import React, { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Link } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Field, Form } from "react-final-form";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";
import "./styles/list.css";
import { Password } from "primereact/password";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";

const ListePWs = () => {
  const [data, setData] = useState();
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [teeth, setTeeth] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currentPW, setCurrentPW] = useState({});
  const [selectGroups, setSelectGoups] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setSelectGoups(
      currentPW.groups ? currentPW.groups.map((group) => group.id) : ""
    );
  }, [currentPW]);

  useEffect(() => {
    axios
      .get(`/api/teeth`)
      .then((response) => {
        setTeeth(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    axios
      .get(`/api/groups`)
      .then((response) => {
        setGroups(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    axios
      .get(`/api/pws`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const getSeverity = () => {
    return "info";
  };
  const groupBodyTemplate = (data) => {
    return data.groups.map((group) => (
      <Tag value={group.code} severity={getSeverity()} rounded />
    ));
  };
  const operationsBodyTemplate = (rowData) => {
    return (
      <div>
        <div className="card flex justify-content-center">
          <Dialog
            header="Modifier un TP"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
          >
            <div className="form">
              <div
                className="flex justify-content-center"
                style={{ justifyContent: "center" }}
              >
                <div className="card">
                  <Form
                    onSubmit={onSubmit}
                    initialValues={{
                      title: currentPW ? currentPW.title : "",
                      objectif: currentPW ? currentPW.objectif : "",
                      docs: currentPW ? currentPW.docs : "",
                      tooth:
                        currentPW && currentPW.tooth ? currentPW.tooth.id : "",
                      groups: "",
                    }}
                    validate={validate}
                    render={({ handleSubmit }) => (
                      <form onSubmit={handleSubmit} className="p-fluid">
                        <Field
                          name="title"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="title"
                                  {...input}
                                  autoFocus
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="title"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Titre*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="objectif"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="objectif"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="objectif"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Objectif*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="docs"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="docs"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="docs"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Docs*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="tooth"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <Dropdown
                                  id="tooth"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                  options={teeth.map((tooth) => {
                                    return {
                                      label: tooth.name,
                                      value: tooth.id,
                                    };
                                  })}
                                />
                                <label
                                  htmlFor="tooth"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Dents*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="groups"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <MultiSelect
                                  id="groups"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                  value={selectGroups}
                                  options={groups.map((group) => {
                                    return {
                                      label: group.code,
                                      value: group.id,
                                    };
                                  })}
                                  onChange={(e) => setSelectGoups(e.value)}
                                />
                                <label
                                  htmlFor="groups"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Groupes*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Button
                          type="submit"
                          label="Enregistrer"
                          className="mt-2"
                        />
                      </form>
                    )}
                  />
                </div>
              </div>
            </div>
          </Dialog>
        </div>
        <div className="card flex justify-content-between">
          <Button
            onClick={() => confirm1(rowData.id)}
            icon="bx bx-trash"
            label="Supprimer"
            className="mr-2"
            severity="danger"
            style={{ marginRight: 20 }}
          ></Button>
          <Button
            icon="bx bx-edit-alt"
            label="Modifier"
            onClick={() => {
              setCurrentPW(rowData);
              setVisible(true);
            }}
          ></Button>
        </div>
      </div>
    );
  };

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

  const header = renderHeader();

  const acceptFunc = (id) => {
    axios
      .delete(`/api/pws/${id}`)
      .then((response) => {
        console.log(response.data);
        axios
          .get(`/api/pws`)
          .then((response) => setData(response.data))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));

    toast.current.show({
      severity: "info",
      summary: "Confirmé",
      detail: "Vous avez accepté",
      life: 3000,
    });
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejeté",
      detail: "Vous avez refusé",
      life: 3000,
    });
  };

  const confirm1 = (id) => {
    confirmDialog({
      message: "Êtes-vous sûr de vouloir supprimer ce TP?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => acceptFunc(id),
      reject,
    });
  };

  const onSubmit = (data, form) => {
    console.log(data);
    data.groups = selectGroups;
    setFormData(data);
    if (data) {
      axios
        .put(`/api/pws/${currentPW.id}`, {
          title: data.title,
          objectif: data.objectif,
          docs: data.docs,
          tooth: {
            id: data.tooth,
          },
          groups: data.groups.map((id) => {
            return { id: id };
          }),
        })
        .then((response) => {
          console.log(response);
          axios
            .get(`/api/pws`)
            .then((response) => {
              setData(response.data);
              console.log(response.data);
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    setSelectGoups([]);
    setVisible(false);
    setShowMessage(true);
  };

  const validate = (data) => {
    let errors = {};
    data.groups = selectGroups;
    if (!data.title) {
      errors.title = "Titre est obligatoire.";
    }
    if (!data.objectif) {
      errors.objectif = "Objectif est obligatoire.";
    }
    if (!data.docs) {
      errors.docs = "Docs est obligatoire.";
    }
    if (!data.tooth) {
      errors.tooth = "Dent est obligatoire.";
    }
    if (!data.groups || data.groups.length === 0) {
      errors.groups = "Groupes est obligatoire.";
    }
    return errors;
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);

  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );

  return (
    <div>
      <main>
        {!data ? (
          <ProgressSpinner />
        ) : (
          <>
            <Dialog
              visible={showMessage}
              onHide={() => setShowMessage(false)}
              position="top"
              footer={dialogFooter}
              showHeader={false}
              breakpoints={{ "960px": "80vw" }}
              style={{ width: "30vw" }}
            >
              <div
                className="flex align-items-center flex-column pt-6 px-3"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <i
                  className="pi pi-check-circle"
                  style={{ fontSize: "5rem", color: "var(--green-500)" }}
                ></i>
                <h5>TP Modifié avec succès!</h5>
              </div>
            </Dialog>
            <h1 className="title">TPs</h1>
            <ul className="breadcrumbs">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li className="divider">/</li>
              <li>
                <a href="#" className="active">
                  Liste des TPs
                </a>
              </li>
            </ul>
            <Toast ref={toast} />
            <ConfirmDialog />
            <DataTable
              value={data}
              header={header}
              filters={filters}
              paginator
              rows={10}
              emptyMessage="Aucun TP trouvée."
            >
              <Column field="id" header="ID" sortable />
              <Column field="title" header="Titre" />
              <Column field="objectif" header="Objectif" />
              <Column field="docs" header="Docs" />
              <Column field={(rowData) => rowData.tooth.name} header="Dent" />
              <Column
                field="groups"
                header="Groupes"
                body={groupBodyTemplate}
              />
              <Column
                field="operations"
                header="Opérations"
                body={(rowData) => operationsBodyTemplate(rowData)}
              />
            </DataTable>
          </>
        )}
      </main>
    </div>
  );
};

export default ListePWs;
