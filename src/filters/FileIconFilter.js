import Vue from 'vue'
import fileIconDefault from '../assets/img/ItemDefault.svg'
import fileIconCss from '../assets/img/ItemCSS.svg'
import fileIconCsv from '../assets/img/ItemCSV.svg'
import fileIconDoc from '../assets/img/ItemDoc.svg'
import fileIconJpg from '../assets/img/ItemJPG.svg'
import fileIconJs from '../assets/img/ItemJS.svg'
import fileIconPdf from '../assets/img/ItemPDF.svg'
import fileIconPhp from '../assets/img/ItemPHP.svg'
import fileIconPng from '../assets/img/ItemPNG.svg'
import fileIconPpt from '../assets/img/ItemPPT.svg'
import fileIconRar from '../assets/img/ItemRAR.svg'
import fileIconTxt from '../assets/img/ItemTXT.svg'
import fileIconXls from '../assets/img/ItemXLS.svg'
import fileIconZip from '../assets/img/ItemZIP.svg'

Vue.filter('fileIconFilter', function (type) {
  if (!type) {
    return fileIconDefault
  }

  var extension = type.substr(type.indexOf('/') + 1)
  switch (extension) {
    case 'css':
      return fileIconCss
    case 'csv':
      return fileIconCsv
    case 'doc':
    case 'docx':
      return fileIconDoc
    case 'jpg':
      return fileIconJpg
    case 'js':
      return fileIconJs
    case 'pdf':
      return fileIconPdf
    case 'php':
      return fileIconPhp
    case 'png':
      return fileIconPng
    case 'ppt':
    case 'pptx':
      return fileIconPpt
    case 'rar':
      return fileIconRar
    case 'txt':
      return fileIconTxt
    case 'xls':
    case 'xlsx':
      return fileIconXls
    case 'zip':
      return fileIconZip
    default:
      return fileIconDefault
  }
})
