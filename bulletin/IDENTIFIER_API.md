# 台风统一编号查询与数据库索引

实现日期：2026-10-03。所有业务入口位于 `bule-koa.js`，查询实现拆分到 `identifierQueries.js`。编号计算由 Python 项目负责，当前阶段不生成或回写任何业务编号。

## 路径和元数据查询

```text
/api?interface=tc-ens-by-identifier&kind=wc&value=wc-0000&initTime=2025-01-01T00%3A00%3A00Z
/api?interface=tc-ens-by-identifier&kind=wi&value=wi-ecmwf-2025-01-0000&ins=ecmwf
/api?interface=tc-ens-by-identifier&kind=wg&value=wg-2025-01-0000
```

- wc 必须指定 initTime，按 UTC 分钟窗口查询全部机构。wi 必须指定单机构 ins，机构须与编号一致。wg 默认查询全部机构。
- wi/wg 不设 48 小时、14 天或编号月份的隐含限制，可选 gte/lte（带时区 ISO 时间，包含端点）。48 小时是算法关联窗口，不是身份检索范围。
- 固定 WPAC，兼容 basinShort2=WP 或 basinShort=W，排除 C-9999。basin 可省略，其他海盆参数拒绝。
- wc/wi 默认 paths=ensemble，返回 tracks；wg 默认 paths=none，返回 meta。显式 paths=all 增加 detTrack；所有模式保留编号、机构、原编号、时次等基础字段。
- 路径模式默认 20、最大 100 文档/页，预算 8 MiB；meta 默认 100、最大 500 文档/页，预算 2 MiB。实际页可因字节预算缩短。
- 按 initTime/_id 升序游标分页。响应包含 success/query/data/page，page 含 count/hasMore/nextCursor。继续携带原查询参数及 cursor 请求，直到 hasMore=false 才获得全部记录。
- 超大单条文档返回 413、code=responseTooLarge，不能静默截成员。参数错误 400，服务暂不可用 503，无数据返回 200 与空 data。
- 游标绑定过滤条件及路径模式，不绑定 limit；续页可调整合法页大小。普通分页不是固定版本数据库快照。
- 索引仅帮助定位和排序，路径仍需读取业务文档；不在轨迹数组上新增索引。

## 可用编号列表

```text
/api?interface=tc-ens-identifiers&kind=wc&initTime=2025-01-01T00%3A00%3A00Z
/api?interface=tc-ens-identifiers&kind=wi&ins=ecmwf
/api?interface=tc-ens-identifiers&kind=wg&gte=2025-01-01T00%3A00%3A00Z&lte=2025-01-31T23%3A59%3A59Z
```

响应 data 每项包含 identifier/documentCount/institutionCount/initializationCount/firstInitTime/lastInitTime。计数范围遵从同一请求条件；不返回成员路径。支持 limit/cursor，默认 100、最多 500、预算 2 MiB。wi/wg 时间范围可选，无范围时列出全部匹配历史编号。

## Schema 与索引准备

两个 API 仓库 Cyclone schema 通过 identifierSchema.js 同步四个可选 String 字段：unidCurrent/unidIns/unidGlobal/tsid。原 schema 已有这些字段，此次统一定义并补齐三条非唯一索引。

| 名称 | 键 |
| --- | --- |
| tc_identity_wc_time_id | `{unidCurrent:1,initTime:1,_id:1}` |
| tc_identity_wi_ins_time_id | `{unidIns:1,ins:1,initTime:1,_id:1}` |
| tc_identity_wg_time_id | `{unidGlobal:1,initTime:1,_id:1}` |

索引采用 simple collation 和对应编号为 String 的部分过滤。字段在 MongoDB 中按实际编号 POST 写入时产生，不需对历史文档增加 null/空字符串，也不建立唯一编号约束。当前 Python 只存 SQLite 时，远端新查询可能合法返回空列表。

2026-10-03 已在 configWriteTC 的 production 目标库实际创建并验证三条索引。部署 MongoDB 为 5.0.32；查询显式包含编号 `$eq` 与 `$type:'string'`，三类 explain 均命中对应索引。真实空结果及编号列表查询通过；非空轨迹行为由测试覆盖，尚未进行正式编号样本人工核验或负载压测。

Cyclone schema 禁用 autoIndex；只读 API 连接不承担建索引。API 所属仓库的维护脚本使用现有 configWriteTC 配置，默认 dry-run，不删除现有索引，不替换业务文档：

```powershell
node bulletin/database/prepareIdentifierIndexes.js --env=production
node bulletin/database/prepareIdentifierIndexes.js --env=production --apply
# 本地数据库配置另行执行（若启用）：
node bulletin/database/prepareIdentifierIndexes.js --env=local --apply
```

无需 Python 或前端数据库直连。索引脚本不打印凭据；失败只输出安全错误代码。权限不足时由数据库管理员在 API 仓库的维护环境执行同一脚本。不会用 syncIndexes 删除存量索引。

## 测试和部署

```powershell
node --test bulletin/identifierQueries.test.js bulletin/identifierUpdates.test.js
node --check bulletin/bule-koa.js
```

测试覆盖三类过滤、分钟边界、48 小时之外及跨月查询、参数拒绝、投影、游标、UTF-8 预算、聚合统计、可选字段/非唯一索引和 Koa HTTP 请求。上线需部署本次 bulletin 文件并重启已有 Koa 服务；现有 POST 路由和旧 GET 接口保持兼容。

编号写入仍为 POST /api/tc-ens/identifiers，仅写编号；本次不调用该接口，不创建业务编号。真实业务样本编号核验和 Python 回算仍为下一阶段。
