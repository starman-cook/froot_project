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

const RegistryForAccountant = () => {
  const todaysPayments = useSelector((state) => state.payments.todaysPayments);
  const todayFiles = useSelector((state) => state.payments.todayFiles);
  const approvedPayments = todaysPayments.filter((p) => p.approved === true);
  const today = moment().format("YYYY-MM-DD");

  let totalAsia = 0;
  approvedPayments.filter((payment) => {
    if (payment.payer === "Froot_Middle_Asia") {
      totalAsia += Number(payment.sum);
    }
    return totalAsia;
  });
  let totalBusiness = 0;
  approvedPayments.filter((payment) => {
    if (payment.payer === "Froot_Бизнес") {
      totalBusiness += Number(payment.sum);
    }
    return totalBusiness;
  });
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

  //   -- 1 вариант скачивание файлов одним архивом--

  //   const downloadFiles = () =>{
  //       let zip = new JSZip();
  //       for (let i=0; i < todayFiles.length; i++) {
  //           const fileName = todayFiles[i].substring(0, todayFiles[i].lastIndexOf('g')+1);
  //           const encodedString = btoa(todayFiles[i]);
  //           console.log('encodedString', encodedString)
  //           // добавим файл
  //           zip.file(fileName, encodedString, {base64: true});
  //       }
  //       // асинхронно получаем готовый архив
  //       zip.generateAsync({type: "blob"}).then(function(content) {
  //           FileSaver.saveAs(content, "download.zip");
  //       });
  //   }

  //   ----2вариант обычного скачивания файлов из массива--
  //   const downloadFiles = () =>{
  //       const fileURLs = [];
  //       approvedPayments.map(p=>{
  //           fileURLs.push(p.image)
  //       })
  //       fileURLs.map(f=>{
  //           download(apiURL + "/uploads/" + f, "file.jpg")
  //       })
  //   }

  // ---вариант 3 данные с бэка--
  //   const downloadFiles = () => {
  //     todayFiles.map((f) => {
  //       download(apiURL + "/uploads/" + f, "file.jpg");
  //     });
  //   };

  return (
    <div className="RegistryForAccountant">
      <h2 className="RegistryForAccountant__title">
        Платежи на сегодня: {today}{" "}
      </h2>
      <div className="RegistryForAccountant__content">
        <div className="RegistryForAccountant__total">
          <h3 className="RegistryForAccountant__total-title">
            Общая сумма платежей по компаниям:
          </h3>
          <div className="flex-column">
            <span className="RegistryForAccountant__total-company">
              "Froot_Middle_Asia": <strong>{totalAsia}</strong> KZT
            </span>
            <span className="RegistryForAccountant__total-company">
              "Froot_Бизнес": <strong>{totalBusiness}</strong> KZT
            </span>
          </div>
        </div>
        <div className="RegistryForAccountant__downloads flex-column">
          <a
            className="RegistryForAccountant__downloads-btn"
            download
            href={"http://localhost:8000/files/" + today + ".xlsx"}
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

      <div>
        <Account
          registry={registry}
          pay={payHandler}
          cancelPay={cancelPayHandler}
          payments={approvedPayments}
        />
      </div>
    </div>
  );
};

export default RegistryForAccountant;
