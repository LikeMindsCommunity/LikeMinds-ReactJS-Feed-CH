import React from 'react';
import { Attachment } from '../../../services/models/resourceResponses/articleResponse';
import { Document, Page, pdfjs } from 'react-pdf';
const url = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = url;
interface PdfMediaViewProps {
  attachment: Attachment;
}
function PdfMediaViewComponent({ attachment }: PdfMediaViewProps) {
  return (
    <div key={attachment?.attachmentMeta?.url}>
      <div
        className="lmPdfViewer"
        onClick={() => {
          window.open(attachment?.attachmentMeta?.url, '_blank');
        }}
        style={{
          cursor: 'pointer'
        }}>
        <Document file={attachment?.attachmentMeta?.url}>
          <Page pageNumber={1} height={200} renderAnnotationLayer={false} renderTextLayer={false} />
        </Document>

        <div className="pdfInfo">
          <div className="iconBox">
            <svg
              width="28"
              height="36"
              viewBox="0 0 28 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24.7312 36C26.5376 36 28 34.5498 28 32.7583V8.23223H21.4194C20.9462 8.23223 20.6022 7.84834 20.6022 7.4218V0H3.22581C1.46237 0 0 1.40758 0 3.19905V32.8009C0 34.5498 1.41935 36 3.22581 36H24.7312ZM22.2365 1.27935V6.6111H27.0107L22.2365 1.27935Z"
                fill="#EF6060"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.23765 25.3398V22.1662H6.87829C7.95541 22.1662 8.7986 21.9115 9.40786 21.4022C10.0171 20.8928 10.3217 20.1968 10.3217 19.3142C10.3217 18.7327 10.1824 18.2141 9.90379 17.7584C9.62515 17.3026 9.22695 16.951 8.70918 16.7036C8.19142 16.4561 7.59152 16.3324 6.90948 16.3324H3.36621V25.3398H5.23765ZM6.90949 20.6629H5.23767V17.8357H6.95316C7.41478 17.8439 7.77659 17.9842 8.03859 18.2564C8.30059 18.5286 8.4316 18.8853 8.4316 19.3266C8.4316 19.7555 8.30163 20.0855 8.04171 20.3164C7.78179 20.5474 7.40438 20.6629 6.90949 20.6629ZM16.5599 24.7954C15.9278 25.1542 15.2145 25.3357 14.4202 25.3398H11.6068V16.3324H14.4015C15.2 16.3324 15.9143 16.5108 16.5443 16.8675C17.1744 17.2243 17.6661 17.7316 18.0196 18.3894C18.3731 19.0472 18.5499 19.7947 18.5499 20.632V21.0464C18.5499 21.8837 18.3762 22.6281 18.029 23.2797C17.6817 23.9314 17.192 24.4366 16.5599 24.7954ZM14.3828 23.8489H13.4783V17.8357H14.4015C15.1376 17.8357 15.697 18.0718 16.0796 18.544C16.4622 19.0163 16.6535 19.7102 16.6535 20.6258V21.1021C16.6452 21.9847 16.4476 22.6632 16.0608 23.1374C15.6741 23.6117 15.1147 23.8489 14.3828 23.8489ZM21.7812 21.6589V25.3398H19.9098V16.3324H25.8235V17.8357H21.7812V20.1618H25.3744V21.6589H21.7812Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="desc">
            <h3>{attachment?.attachmentMeta?.name?.split('.pdf')[0]}</h3>
            <div>
              <span>
                {Math.floor(parseInt(attachment?.attachmentMeta?.size!.toString()) / 1024)} KB
              </span>
              <span>PDF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfMediaViewComponent;