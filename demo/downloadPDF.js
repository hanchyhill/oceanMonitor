async function downloadPDF(pdf_base64='') {
    const tempLink = document.createElement('a');
    tempLink.download = `download.pdf`;
    const BlobURL = await fetch(`data:application/pdf;base64,${pdf_base64}`)
        .then(res => res.blob())
        .then(blob => URL.createObjectURL(blob));
    tempLink.href = BlobURL;
    tempLink.click();
}
let pdf_base64='base64YouReceiveFromServer';
let dataURL = `data:application/pdf;base64,${pdf_base64}`;
document.write(`
<object type="application/pdf"
    data="${dataURL}"
    width="250"
    height="200">
</object>
`); 