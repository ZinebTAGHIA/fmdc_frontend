import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GroupChart from "../components/GroupChart";
import StudentChart from "../components/StudentChart";
import { ProgressSpinner } from "primereact/progressspinner";
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
  const [nbrStudents, setNbrStudents] = useState(0);
  const [nbrGroups, setNbrGroups] = useState(0);
  const [nbrPWs, setNbrPWs] = useState(0);
  const [NbrTeeth, setNbrTeeth] = useState(0);
  const [pws, setPWs] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const allProgress = document.querySelectorAll("main .card .progress");

    axios
      .get(`/api/students`)
      .then((response) => setNbrStudents(response.data.length))
      .catch((error) => console.error(error));
    axios
      .get(`/api/groups`)
      .then((response) => {
        setNbrGroups(response.data.length);
        setGroups(response.data);
      })
      .catch((error) => console.error(error));
    axios
      .get(`/api/pws`)
      .then((response) => {
        setNbrPWs(response.data.length);
        setPWs(response.data);
      })
      .catch((error) => console.error(error));
    axios
      .get(`/api/teeth`)
      .then((response) => setNbrTeeth(response.data.length))
      .catch((error) => console.error(error));

    allProgress.forEach((item) => {
      item.style.setProperty("--value", item.dataset.value);
    });
  }, []);

  return (
    <Container>
      <main>
        {!nbrStudents || !nbrGroups || !nbrPWs || !NbrTeeth ? (
          <div>
            <ProgressSpinner />
          </div>
        ) : (
          <>
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
                    <i class="fa-solid fa-user-doctor fa-2xl"></i>
                    <p>Nombre d'étudiants</p>
                    <h2>{nbrStudents}</h2>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="head">
                  <div>
                    <i class="bx bxs-group bx-md"></i>
                    <p>Nombre de groupes</p>
                    <h2>{nbrGroups}</h2>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="head">
                  <div>
                    <i class="fas fa-tooth fa-2xl"></i>
                    <p>Nombre de dents</p>
                    <h2>{NbrTeeth}</h2>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="head">
                  <div>
                    <i class="fa-solid fa-syringe fa-2xl"></i>
                    <p>Nombre de TPs</p>
                    <h2>{nbrPWs}</h2>
                  </div>
                </div>
              </div>
            </div>
            {nbrGroups && NbrTeeth && nbrPWs ? (
              <div className="data">
                <div className="content-data">
                  <div className="head">
                    <h3>Nombre de groupes par TP</h3>
                  </div>
                  <div className="chartContainer">
                    <div id="GroupChart">
                      <GroupChart pws={pws} />
                    </div>
                  </div>
                </div>
                <div className="content-data">
                  <div className="head">
                    <h3>Nombre d'étudiants par groupe</h3>
                  </div>
                  <div className="chartContainer">
                    <div id="StudentChart">
                      <StudentChart groups={groups} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="data"></div>
            )}{" "}
          </>
        )}
      </main>
    </Container>
  );
};

export default Dashboard;
