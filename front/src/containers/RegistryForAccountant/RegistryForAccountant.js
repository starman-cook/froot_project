import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Account from "../../components/Account/Account";
import {
  fetchCancelPaid,
  fetchPaid,
  fetchTodaysFiles,
  fetchTodaysPayments,
} from "../../store/actions/paymentAction";
import moment from "moment";
import JSZip from "jszip";
import FileSaver from "file-saver";
import "./RegistryForAccountant.css";
import { apiURL } from "../../config";
import { download } from "../../../src/functions";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import Total from "../../components/Total/Total";

const RegistryForAccountant = () => {
  const todaysPayments = useSelector((state) => state.payments.todaysPayments);
  const todayFiles = useSelector((state) => state.payments.todayFiles);
  const approvedPayments = todaysPayments.filter((p) => p.approved === true);
  const today = moment().format("YYYY-MM-DD");

  const registry = true;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTodaysPayments());
    dispatch(fetchTodaysFiles());
  }, [dispatch]);
  const payHandler = (id) => {
    dispatch(fetchPaid(id));
  };
  const cancelPayHandler = (id) => {
    dispatch(fetchCancelPaid(id));
  };

  const downloadFiles = () => {
    let urls = todaysPayments.map(
      (payment) => apiURL + "/uploads/" + payment.image
    );
    var zip = new JSZip();
    var count = 0;
    urls.forEach(function (url) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err;
        }
        var filename = url.replace(/.*\//g, "");
        zip.file(filename, data, { binary: true, createFolders: true });
        count++;
        if (count == urls.length) {
          zip
            .generateAsync({
              type: "blob",
            })
            .then(function (content) {
              saveAs(content);
            });
        }
      });
    });
  };

  return (
    <div className="RegistryForAccountant">
      <div className="RegistryForAccountant__content">
        <div className="RegistryForAccountant__header">
          <h2 className="RegistryForAccountant__title">Платежи для оплаты на сегодня: {today} </h2>
          <div className="RegistryForAccountant__downloads">
            <a
              className="RegistryForAccountant__downloads-btn"
              download
              href={apiURL+"/files/" + today + ".xlsx"}
            >
              Формирование Excell
            </a>
            <a
              className="RegistryForAccountant__downloads-btn"
              onClick={downloadFiles}
            >
              Скачать все файлы
            </a>
          </div>    
        </div>
        <Total payments={approvedPayments}/>
      </div>
      <Account
          registry={registry}
          pay={payHandler}
          cancelPay={cancelPayHandler}
          payments={approvedPayments}
        />
    </div>
  );
};

export default RegistryForAccountant;
