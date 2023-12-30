import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DemandesChart from "../components/StudentsChart";
import ComptesChart from "../components/PWChart";
import { ProgressSpinner } from "primereact/progressspinner";
import { ProgressBar } from "primereact/progressbar";
import axios from "../api/axios";
import styled from "styled-components";

const Container = styled.div`
  .p-progressbar-label {
    display: none !important;
  }

  .p-progressbar .p-progressbar-value {
    background-color: #1775f1 !important;
  }

  .p-progressbar {
    background-color: #f1f0f6 !important;
    border-radius: 10px !important;
    height: 15px !important;
  }
`;

const Dashboard = ({ user }) => {
  const [nbrDemandes, setNbrDemandes] = useState(0);
  const [nbrDemEnAtt, setNbrDemEnAtt] = useState(0);
  const [nbrDemRef, setNbrDemRef] = useState(0);
  const [nbrDemVal, setNbrDemVal] = useState(0);
  const [nbrComptes, setNbrComptes] = useState(0);
  const [nbrComptesAct, setNbrComptesAct] = useState(0);
  const [nbrComptesDesact, setNbrComptesDesact] = useState(0);

  // useEffect(() => {
  //   const allProgress = document.querySelectorAll("main .card .progress");

  //   axios
  //     .get(`/api/nbr/demandes`)
  //     .then((response) => setNbrDemandes(response.data.total))
  //     .catch((error) => console.error(error));
  //   axios
  //     .get(`/api/nbr/demandes/en attente`)
  //     .then((response) => setNbrDemEnAtt(response.data.total))
  //     .catch((error) => console.error(error));
  //   axios
  //     .get(`/api/nbr/demandes/validée`)
  //     .then((response) => setNbrDemVal(response.data.total))
  //     .catch((error) => console.error(error));
  //   axios
  //     .get(`/api/nbr/demandes/refusée`)
  //     .then((response) => setNbrDemRef(response.data.total))
  //     .catch((error) => console.error(error));

  //   axios
  //     .get(`/api/nbr/etudiants`)
  //     .then((response) => setNbrComptes(response.data.total))
  //     .catch((error) => console.error(error));
  //   axios
  //     .get(`/api/nbr/etudiants/true`)
  //     .then((response) => setNbrComptesAct(response.data.total))
  //     .catch((error) => console.error(error));
  //   axios
  //     .get(`/api/nbr/etudiants/false`)
  //     .then((response) => setNbrComptesDesact(response.data.total))
  //     .catch((error) => console.error(error));

  //   allProgress.forEach((item) => {
  //     item.style.setProperty("--value", item.dataset.value);
  //   });
  // }, []);

  return (
    <Container>
      <main>
        {/* {!nbrDemandes ||
        !nbrDemEnAtt ||
        !nbrDemRef ||
        !nbrDemVal ||
        !nbrComptes ||
        !nbrComptesAct ||
        !nbrComptesDesact ? (
          <div>
            <ProgressSpinner />
          </div>
        ) : ( */}
        <>
          {" "}
          <h1 className="title">Tableau de bord</h1>
          <ul className="breadcrumbs">
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li className="divider">/</li>
            <li>
              <a href="#" className="active">
                Tableau de bord
              </a>
            </li>
          </ul>
          <div className="info-data">
            <div className="card">
              <div className="head">
                <div>
                  <i className="bx bxs-hourglass-top bx-md"></i>
                  <p>Demandes en attentes</p>
                  <h2>{nbrDemEnAtt}</h2>
                </div>
              </div>
              <ProgressBar
                value={((nbrDemEnAtt * 100) / nbrDemandes).toFixed(2)}
              ></ProgressBar>
              <span className="label">
                {!nbrDemEnAtt || !nbrDemandes
                  ? 0
                  : ((nbrDemEnAtt * 100) / nbrDemandes).toFixed(2)}
                %
              </span>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <i className="bx bx-check bx-md"></i>
                  <p>Demandes validées</p>
                  <h2>{nbrDemVal}</h2>
                </div>
              </div>
              <ProgressBar
                value={((nbrDemVal * 100) / nbrDemandes).toFixed(2)}
              ></ProgressBar>
              <span className="label">
                {!nbrDemVal || !nbrDemandes
                  ? 0
                  : ((nbrDemVal * 100) / nbrDemandes).toFixed(2)}
                %
              </span>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <i className="bx bxs-trash bx-md"></i>
                  <p>Demandes refusées</p>
                  <h2>{nbrDemRef}</h2>
                </div>
              </div>
              <ProgressBar
                value={((nbrDemRef * 100) / nbrDemandes).toFixed(2)}
              ></ProgressBar>
              <span className="label">
                {!nbrDemRef || !nbrDemandes
                  ? 0
                  : ((nbrDemRef * 100) / nbrDemandes).toFixed(2)}
                %
              </span>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <i className="bx bxs-user-check bx-md"></i>
                  <p>Comptes activés</p>
                  <h2>{nbrComptesAct}</h2>
                </div>
              </div>
              <ProgressBar
                value={((nbrComptesAct * 100) / nbrComptes).toFixed(2)}
              ></ProgressBar>
              <span className="label">
                {!nbrComptesAct || !nbrComptes
                  ? 0
                  : ((nbrComptesAct * 100) / nbrComptes).toFixed(2)}
                %
              </span>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <i className="bx bxs-user-x bx-md"></i>
                  <p>Comptes désactivés</p>
                  <h2>{nbrComptesDesact}</h2>
                </div>
              </div>
              <ProgressBar
                value={((nbrComptesDesact * 100) / nbrComptes).toFixed(2)}
              ></ProgressBar>
              <span className="label">
                {!nbrComptesDesact || !nbrComptes
                  ? 0
                  : ((nbrComptesDesact * 100) / nbrComptes).toFixed(2)}
                %
              </span>
            </div>
          </div>
          {nbrComptesAct &&
          nbrComptesDesact &&
          nbrDemEnAtt &&
          nbrDemVal &&
          nbrDemRef ? (
            <div className="data">
              <div className="content-data">
                <div className="head">
                  <h3>Demandes</h3>
                </div>
                <div className="chartContainer">
                  <div id="chartDemandes">
                    <DemandesChart
                      nbrDemEnAtt={nbrDemEnAtt}
                      nbrDemVal={nbrDemVal}
                      nbrDemRef={nbrDemRef}
                    />
                  </div>
                </div>
              </div>
              <div className="content-data">
                <div className="head">
                  <h3>Comptes</h3>
                </div>
                <div className="chartContainer">
                  <div id="chartComptes">
                    <ComptesChart
                      nbrComptesAct={nbrComptesAct}
                      nbrComptesDesact={nbrComptesDesact}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="data"></div>
          )}{" "}
        </>
        {/* )} */}
      </main>
    </Container>
  );
};

export default Dashboard;
