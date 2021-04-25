const got = require('got');
const { pMakeDir, isExists } = require('../../crawler/lib/util.js');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const stream = require('stream');
const pMap = require('p-map');

const pipeline = promisify(stream.pipeline);
const pStat = promisify(fs.stat);
const pDelete = promisify(fs.unlink);
const config = {
  irImg: {
    openUrl: 'https://apps.ecmwf.int/webapps/opencharts-api/v1/packages/opencharts/products/medium-simulated-ir/',
    preojectionList: ['opencharts_south_east_asia_and_indonesia', "opencharts_eastern_asia"],
    fetchImgUrlBuilder(basetime = '202104100000', validtime = '202104100000', preojection = 'opencharts_south_east_asia_and_indonesia') {
      return `https://apps.ecmwf.int/webapps/opencharts-api/v1/packages/opencharts/products/medium-simulated-ir/axis/valid_time/?base_time=${basetime}&projection=${preojection}&values=${validtime}`;
    },
    filePrefix: 'ec_ir',
  },
  tccImg: {
    openUrl: 'https://apps.ecmwf.int/webapps/opencharts-api/v1/packages/opencharts/products/medium-clouds/',
    preojectionList: ['opencharts_south_east_asia_and_indonesia', "opencharts_eastern_asia"],
    fetchImgUrlBuilder(basetime = '202104100000', validtime = '202104100000', preojection = 'opencharts_south_east_asia_and_indonesia') {
      return `https://apps.ecmwf.int/webapps/opencharts-api/v1/packages/opencharts/products/medium-clouds/axis/valid_time/?base_time=${basetime}&projection=${preojection}&values=${validtime}`;
    },
    filePrefix: 'ec_tcc',
  },
  wvImg: {
    openUrl: 'https://apps.ecmwf.int/webapps/opencharts-api/v1/packages/opencharts/products/medium-simulated-wv/',
    preojectionList: ['opencharts_south_east_asia_and_indonesia', "opencharts_eastern_asia"],
    layerNameList: ['sim_image_wv', 'sim_image_wv_ch6'],
    fetchImgUrlBuilder(basetime = '202104100000', validtime = '202104100000', preojection = 'opencharts_south_east_asia_and_indonesia', layerName = 'sim_image_wv') {
      return `https://apps.ecmwf.int/webapps/opencharts-api/v1/packages/opencharts/products/medium-simulated-wv/axis/valid_time/?base_time=${basetime}&projection=${preojection}&values=${validtime}&layer_name=${layerName}`;
    },
    filePrefix: 'ec_wv',

  }
}

const basePath = path.resolve(__dirname + './../../../data/img/ec_cloud/');

async function openWebsite(taskConfig) {
  const response = await got(taskConfig.openUrl)
    .catch(err => { throw err });
  const metaInfo = JSON.parse(response.body);
  const currentBaseTime = metaInfo.values.base_time;
  const timeArr = metaInfo.axis[0].values[0].linked_values.map(item => item.value);
  // console.log('basetime: ' + currentBaseTime); // 202104100000
  // console.log(timeArr); // (45) ['202104100000', '202104100300', '202104100600',...,'202104200000']
  return {
    basetime: currentBaseTime,
    timeList: timeArr,
  }
}

async function getImgUrl(fetchBuilder, basetime = '202104100000', validtime = '202104100000', preojection = 'opencharts_south_east_asia_and_indonesia', layerName) {
  const infoUrl = fetchBuilder(basetime, validtime, preojection, layerName);
  const response = await got(infoUrl);
  const imgInfo = JSON.parse(response.body);
  const imgUrl = imgInfo.results[validtime].url;
  // console.log(imgUrl);
  return imgUrl;
}

async function storeImg(imgUrl, dirPath, targetImgName) {// "https://apps.ecmwf.int/webapps/opencharts/streaming/20210410-1130/1a/render-worker-commands-6b585b4f49-vqvcr-6fe5cac1a363ec1525f54343b6cc9fd8-47cJxk.png"
  let feedback;

  await pMakeDir(dirPath);
  const filePath = path.resolve(dirPath, targetImgName);
  let isFileExists = await isExists(filePath);
  if (!isFileExists) {
    try {
      await pipeline(
        got.stream(imgUrl),
        fs.createWriteStream(filePath)
      );
    } catch (err) {
      console.log('下载图像发生错误, 正在尝试删除');
      let isErrorFileExists = await isExists(filePath);
      console.log('是否存在错误数据: ' + isErrorFileExists);
      if (isErrorFileExists) await pDelete(filePath);
      feedback = {
        error: true,
        fileName: targetImgName,
        path: dirPath,
        message: `${targetImgName}获取发生错误: ${err.message}`,
        url: imgUrl,
      };
      return feedback;
    }
    feedback = {
      success: true,
      fileName: targetImgName,
      path: dirPath,
      message: `文件创建成功${targetImgName}`,
    }
    return feedback;
  } else {
    feedback = {
      success: true,
      fileName: targetImgName,
      path: dirPath,
      message: `文件已存在${targetImgName}`,
    }
    return feedback;
  }
}

/**
 * 
 * @param {Object} taskConfig 创建任务数组
 * @returns {Array}
 */
function createTaskList(taskConfig) {
  let taskList = [];
  if (taskConfig.preojectionList) {
    taskConfig.preojectionList.forEach(item => {
      taskList.push({ projection: item });
    })
  }
  if (taskConfig.layerNameList) {
    let tempList = [];
    taskConfig.layerNameList.forEach(item => {
      taskList.forEach(preItem => {
        let copyItem = Object.assign({}, preItem);
        copyItem.layerName = item;
        tempList.push(copyItem);
      })
    })
    taskList = tempList;
  }
  return taskList;

}

async function handleImgDownload({ taskConfig, basetime, validtime, projection, layerName } = {}) {
  try {
    let imgFileName = `${taskConfig.filePrefix}_${projection}_${layerName ? layerName + '_' : ''}base${basetime}_valid${validtime}.png`;
    let dirPath = path.resolve(basePath, `./${basetime.slice(0, 6)}/${basetime.slice(0, 10)}/`);
    let filePath = path.resolve(dirPath, imgFileName);
    let isFileExists = await isExists(filePath);
    if (!isFileExists) {
      let imgUrl = await getImgUrl(taskConfig.fetchImgUrlBuilder, basetime, validtime, projection, layerName)
        .catch(err => { console.log('获取图像地址发生错误:' + imgFileName) });
      // imgUrl = "https://apps.ecmwf.int/webapps/opencharts/streaming/20210410-1130/1a/render-worker-commands-6b585b4f49-vqvcr-6fe5cac1a363ec1525f54343b6cc9fd8-47cJxk.png";

      let response = await storeImg(imgUrl, dirPath, imgFileName);
      console.log(response.message);
      return response.message;
    }
    else {
      let fileStatus = await pStat(filePath);
      if (fileStatus.size < 102400) {// 442302
        console.log('删除异常文件重新下载' + imgFileName);
        await pDelete(filePath);
        let imgUrl = await getImgUrl(taskConfig.fetchImgUrlBuilder, basetime, validtime, projection, layerName)
          .catch(err => { console.log('获取图像地址发生错误:' + imgFileName) });
        let response = await storeImg(imgUrl, dirPath, imgFileName);
        console.log(response.message);
        return response.message;
      }else{
        console.log(`文件已存在${imgFileName}`);
        return `文件已存在${imgFileName}`;
      }
    }
  } catch (e) {

    return e.message;
  }
}

async function getEcImg(taskConfig) {
  // openIRwebsite();
  // let basetime='202104100000', validtime='202104100000', projection = 'opencharts_south_east_asia_and_indonesia';
  let imgTypeList = createTaskList(taskConfig);
  for (let iType of imgTypeList) {
    let projection = iType.projection;
    let layerName = iType.layerName || null;
    let currentInfo = await openWebsite(taskConfig).catch(err => {
      throw err;
    });
    let basetime = currentInfo.basetime;
    let timeList = currentInfo.timeList;
    taskList = timeList.map(fc => {
      return {
        taskConfig,
        basetime,
        validtime: fc,
        projection,
        layerName,
      }
    });
    try {
      await pMap(taskList, handleImgDownload, { stopOnError: false, concurrency: 5 });
      // console.log(result);
      // return result;
    } catch (err) {
      throw err;
    }
  }
}

async function getCloudImgMain() {
  await getEcImg(config.irImg).catch(err => {
    console.error(err);
  });
  await getEcImg(config.tccImg).catch(err => {
    console.error(err);
  });
  await getEcImg(config.wvImg).catch(err => {
    console.error(err);
  });
  console.log('完成本次EC图像下载');
}

if (require.main === module) {
  console.log('called directly');
} else {
  console.log('required as a module');
  exports.getEcmwfCloud = getCloudImgMain;
}

getCloudImgMain();

// getEcImg(config.mvImg);