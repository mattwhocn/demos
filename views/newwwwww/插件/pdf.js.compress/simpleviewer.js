/* Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

if (!PDFJS.PDFViewer || !PDFJS.getDocument) {
  alert('Please build the pdfjs-dist library using\n' +
        '  `gulp dist`');
}

// The workerSrc property shall be specified.
//
PDFJS.workerSrc = 'build/pdf.worker.min.js';

// Some PDFs need external cmaps.
//
// PDFJS.cMapUrl = '../../build/dist/cmaps/';
// PDFJS.cMapPacked = true;





var DEFAULT_URL = 'default.pdf';
//==================================================
//=========iframe 跨域
//var iframe = document.createElement("iframe");
//iframe.src = 'http://banji.oss-cn-shanghai.aliyuncs.com/organization/course/1/course.pdf?cb=callback';
//document.body.appendChild(iframe);
//
//function callback(res){
//	var DEFAULT_URL = res;
//}

//=========script src跨域
//var scObj = document.createElement("script");
//scObj.src = 'http://banji.oss-cn-shanghai.aliyuncs.com/organization/course/1/course.pdf?cb=callback';
//document.body.appendChild(scObj);
//
//function callback(res){
//	console.log(res);
//	var DEFAULT_URL = res;
//}


//=======jsonp跨域
$.ajax({
	type:"get",
	url:"data.json",
	async:true,
	success:function(res){
		console.log(res);
		var DEFAULT_URL = res.url;
	}
});


//========接受地址栏传来的pdf文件名=========//
//var pdf_file_name = window.location.href.split('?')[1];
//var DEFAULT_URL = "banji.oss-cn-shanghai.aliyuncs.com/organization/course/1/course.pdf"

//=========自定义代码，替换pdf文件=========//





var SEARCH_FOR = ''; // try 'Mozilla';

var container = document.getElementById('viewerContainer');

// (Optionally) enable hyperlinks within PDF files.
var pdfLinkService = new PDFJS.PDFLinkService();

var pdfViewer = new PDFJS.PDFViewer({
  container: container,
  linkService: pdfLinkService,
});
pdfLinkService.setViewer(pdfViewer);

// (Optionally) enable find controller.
var pdfFindController = new PDFJS.PDFFindController({
  pdfViewer: pdfViewer
});
pdfViewer.setFindController(pdfFindController);

container.addEventListener('pagesinit', function () {
  // We can use pdfViewer now, e.g. let's change default scale.
  pdfViewer.currentScaleValue = 'page-width';

  if (SEARCH_FOR) { // We can try search for things
    pdfFindController.executeCommand('find', {query: SEARCH_FOR});
  }
});

// Loading document.
PDFJS.getDocument(DEFAULT_URL).then(function (pdfDocument) {
  // Document loaded, specifying document for the viewer and
  // the (optional) linkService.
  pdfViewer.setDocument(pdfDocument);

  pdfLinkService.setDocument(pdfDocument, null);
});

////在js读取完成之后删除hint标签
//var hint = document.querySelectorAll(".hint")[0];
//hint.remove();、
//document.getElementsByTagName()
