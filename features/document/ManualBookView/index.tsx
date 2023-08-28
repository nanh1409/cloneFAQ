import { Button, Container, TablePagination, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { ChangeEvent, Fragment, MouseEvent, useCallback, useState } from "react";
import {
  Document as PDFDocument,
  Page as PDFPage
} from "react-pdf";
import { SizeMe } from "react-sizeme";
import Introduction from "../../../components/introduction";
import Loading from "../../../components/loading/Loading";
import NextLink from "../../../components/NextLink";
import WebSeo from "../../../modules/share/model/webSeo";
import "./manualBookView.scss";

const PDFWorkerClient = dynamic(() => import("../PDFWorkerClient"), { ssr: false });

const ManualBookView = (props: {
  documentURL: string;
  practiceURL?: string;
  seoInfo?: WebSeo;
}) => {
  const { documentURL, practiceURL, seoInfo } = props;
  const [totalPDFPage, setTotalPDFPage] = useState(0);
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const handleChangePage = (evt: MouseEvent<HTMLButtonElement>, page: number) => {
    setPage(page)
  }

  const handleChangeRowsPerPage = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(+evt.target.value);
    setPage(0)
  }

  const handleDownloadPDF = () => {
    const fileName = documentURL.slice(documentURL.lastIndexOf('/'), documentURL.length);
    let anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(new Blob([fileData]));
    anchor.download = fileName;
    anchor.click();
  }

  const renderDownloadPDFButton = useCallback(() => {
    return <Button
      classes={{ root: "download-pdf-btn" }}
      variant="contained" color="primary" onClick={handleDownloadPDF}
    >
      Download PDF
    </Button>
  }, [isTabletUI, fileData, documentURL]);

  const renderPracticeNowButton = useCallback(() => {
    return <NextLink href={practiceURL || "#"}><Button
      classes={{ root: "practice-now-btn" }}
      variant="contained" color="primary"
    >
      Practice Now
    </Button></NextLink>
  }, [isTabletUI, practiceURL]);

  return <>
    <PDFWorkerClient />
    <div className={classNames("manual-book-view", isTabletUI ? "tablet" : "")}>
      <Container maxWidth="xl">
        <div className="manual-book-view-container">
          {!isTabletUI && <div className="book-functions">
            {renderDownloadPDFButton()}
            {renderPracticeNowButton()}
          </div>}
          <TablePagination
            component="div"
            count={totalPDFPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            classes={{ root: "book-pagination" }}
            labelRowsPerPage="Show Pages"
          />
        </div>
        <h1 className="title-h1">{seoInfo?.titleH1}</h1>
        <SizeMe
          monitorHeight
          refreshRate={128}
          refreshMode="debounce"
        >{({ size }) => <PDFDocument
          className="pdf-document"
          file={documentURL}
          loading={<Loading />}
          onLoadSuccess={(doc) => {
            doc.getData().then((data) => setFileData(data));
            setTotalPDFPage(doc?._pdfInfo?.numPages ?? 0)
          }}
        >
          {new Array(rowsPerPage).fill("").map((_, idx) => {
            const curPDFPageIdx = idx + rowsPerPage * page;
            return curPDFPageIdx < totalPDFPage
              ? <PDFPage
                width={size.width}
                key={idx}
                className="pdf-page"
                pageIndex={curPDFPageIdx}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
              : <Fragment key={idx}></Fragment>
          })}
        </PDFDocument>}
        </SizeMe>

        <Introduction content={seoInfo?.content ?? ""} />
      </Container>
    </div>
    {isTabletUI && <div className="manual-book-view-download-app-tablet">
      {renderDownloadPDFButton()}
      {renderPracticeNowButton()}
    </div>}
  </>
}

export default ManualBookView;
