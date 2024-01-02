import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import "./styles/list.css";
import { Panel } from "primereact/panel";
import StudentTPsChart from "../components/StudentTPsChart";
import RowExpansionContent from "../components/RowExpansionContent";
import { Dialog } from "primereact/dialog";

const EtudiantsByGroup = (props) => {
  const [data, setData] = useState();
  const [groups, setGroups] = useState([]);
  const [selectGroup, setSelectGroup] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [expandedRows, setExpandedRows] = useState(null);
  const [studentImages, setStudentImages] = useState({});
  const [displayDialog, setDisplayDialog] = useState(false);
  const [selectedPWImages, setSelectedPWImages] = useState(null);

  const showDialog = (imagesData) => {
    setSelectedPWImages(imagesData);
    setDisplayDialog(true);
  };

  const onHide = () => {
    setDisplayDialog(false);
  };

  useEffect(() => {
    if (props.user && props.user.id) {
      axios
        .get(`/api/professors/professor/${props.user.id}/groups`)
        .then((response) => {
          setGroups(response.data);
        })
        .catch((error) => {});
    }
  }, [props.user]);

  useEffect(() => {
    if (selectGroup) {
      axios
        .get(`/api/groups/students/${selectGroup}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {});
    }
  }, [selectGroup]);

  useEffect(() => {
    const fetchStudentImages = async (students) => {
      const imageUrls = {};
      for (const student of students) {
        try {
          const response = await axios.get(
            `/api/students/student/${student.id}/image`,
            {
              responseType: "arraybuffer",
            }
          );
          const blob = new Blob([response.data], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);
          imageUrls[student.id] = imageUrl;
        } catch (error) {
          imageUrls[student.id] = null;
        }
      }
      setStudentImages(imageUrls);
    };

    if (data && data.length > 0) {
      fetchStudentImages(data);
    }
  }, [data]);

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
  };

  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";

    return (
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={value || ""}
          onChange={(e) => onGlobalFilterChange(e)}
          placeholder="Global Search"
        />
      </span>
    );
  };

  const studentBodyTemplate = (rowData) => {
    const studentImg = studentImages[rowData.id];

    return (
      <div className="flex align-items-center gap-2">
        <img
          src={
            studentImg !== null
              ? studentImg
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          width={32}
          alt={""}
        />
      </div>
    );
  };

  const allowExpansion = (rowData) => {
    return true;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <>
        <RowExpansionContent studentId={data.id} showDialog={showDialog} />
        <Dialog visible={displayDialog} onHide={onHide}>
          <h3>ID: {/* Display selectedPWImages.pwId here */}</h3>
          {selectedPWImages && (
            <>
              <img
                src={`data:image/jpeg;base64,${selectedPWImages.imageFront}`}
                alt="Image Front"
              />
              <img
                src={`data:image/jpeg;base64,${selectedPWImages.imageSide}`}
                alt="Image Side"
              />
            </>
          )}
        </Dialog>
      </>
    );
  };

  const header = renderHeader();

  return (
    <div>
      <main>
        <>
          <h1 className="title">Etudiants</h1>
          <ul className="breadcrumbs">
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li className="divider">/</li>
            <li>
              <a href="#" className="active">
                Liste des étudiants
              </a>
            </li>
          </ul>
          <Panel header="Sélectionner un groupe">
            <Dropdown
              id="group"
              value={selectGroup}
              onChange={(e) => setSelectGroup(e.value)}
              options={groups.map((group) => {
                return {
                  label: group.code,
                  value: group.id,
                };
              })}
            ></Dropdown>
          </Panel>
          <DataTable
            value={data}
            header={header}
            filters={filters}
            paginator
            rows={10}
            emptyMessage="Aucun étudiant trouvée."
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
          >
            <Column expander={allowExpansion} style={{ width: "5rem" }} />
            <Column field="id" header="ID" sortable />
            <Column
              field="photo"
              header="Photo"
              body={studentBodyTemplate}
              filter
              filterPlaceholder="Search"
            />

            <Column field="lastName" header="Nom" />
            <Column field="firstName" header="Prénom" />
          </DataTable>
        </>
      </main>
    </div>
  );
};

export default EtudiantsByGroup;
