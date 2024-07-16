import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Container,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import "./styles.css";
import NavBar from "../../components/NavBar";

const Manage = () => {
  const [spaceName, setSpaceName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [availability, setAvailability] = useState([{ day: "", times: [""] }]);
  const [spaces, setSpaces] = useState([]);
  const [editingSpace, setEditingSpace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [canceledReservations, setCanceledReservations] = useState([]);

  const fetchSpaces = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/espaco/listar-espacos"
      );
      const data = await response.json();
      setSpaces(
        data.reservas.map((space) => ({
          ...space,
          horarios_disponiveis: space.horarios_disponiveis.map((horario) => ({
            ...horario,
            dia: new Date(horario.dia).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          })),
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar espaços:", error);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleEditClick = (space) => {
    setEditingSpace(space);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingSpace(null);
    setShowModal(false);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/espaco/editar-espaco/${editingSpace.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingSpace),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Espaço atualizado com sucesso:", data);
        setEditingSpace(null);
        setShowModal(false);
        setSpaces((prevSpaces) =>
          prevSpaces.map((space) =>
            space.id === data.data.id ? data.data : space
          )
        );
        fetchSpaces();
      } else {
        console.error("Erro ao atualizar espaço:", data.error);
      }
    } catch (error) {
      console.error("Erro ao atualizar espaço:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSpace((prevSpace) => ({
      ...prevSpace,
      [name]: value,
    }));
  };

  const handleHorarioChange = (dia, horarioIndex, value) => {
    setEditingSpace((prevSpace) => ({
      ...prevSpace,
      horarios_disponiveis: prevSpace.horarios_disponiveis.map((h, i) =>
        h.dia === dia
          ? {
              ...h,
              horarios: h.horarios.map((hor, index) =>
                index === horarioIndex
                  ? { horario: value, disponivel: true }
                  : hor
              ),
            }
          : h
      ),
    }));
  };

  const handleSpaceNameChange = (e) => setSpaceName(e.target.value);
  const handleCapacityChange = (e) => setCapacity(e.target.value);

  const handleDayChange = (index, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].day = value;
    setAvailability(updatedAvailability);
  };

  const handleTimeChange = (index, timeIndex, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].times[timeIndex] = value;
    setAvailability(updatedAvailability);
  };

  const handleAddDay = () => {
    setAvailability([...availability, { day: "", times: [""] }]);
  };

  const handleAddTime = (index) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].times.push("");
    setAvailability(updatedAvailability);
  };

  const handleRemoveTime = (index, timeIndex) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].times.splice(timeIndex, 1);
    setAvailability(updatedAvailability);
  };

  const handleCheckboxChange = (dia, horarioIndex) => {
    setSelectedTimes((prevSelected) => {
      const key = `${dia}-${horarioIndex}`;
      if (prevSelected.includes(key)) {
        return prevSelected.filter((item) => item !== key);
      } else {
        return [...prevSelected, key];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      espaco_nome: spaceName,
      capacidade: capacity,
      horarios_disponiveis: availability.map((item) => ({
        dia: item.day,
        horarios: item.times.map((time) => ({
          horario: time,
          disponivel: true,
        })),
      })),
    };
    try {
      const response = await fetch(
        "http://localhost:3000/espaco/adicionar-espaco",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Espaço adicionado com sucesso:", data);
        fetchSpaces();
        setSpaceName("");
        setCapacity("");
        setAvailability([{ day: "", times: [""] }]);
      } else {
        console.error("Erro ao adicionar espaço:", data.error);
      }
    } catch (error) {
      console.error("Erro ao adicionar espaço:", error);
    }
  };

  const handleDeleteClick = (space) => {
    setSpaceToDelete(space);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/espaco/excluir-espaco/${spaceToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Espaço excluído com sucesso:", data);
        setShowDeleteModal(false);
        fetchSpaces();
      } else {
        console.error("Erro ao excluir espaço:", data.error);
      }
    } catch (error) {
      console.error("Erro ao excluir espaço:", error);
    }
  };

  const handleDeleteSelectedTimes = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/espaco/excluir-horarios/${editingSpace.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ horariosExcluir: selectedTimes }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Horários excluídos com sucesso:", data);
        setEditingSpace(data.data);
        setSelectedTimes([]);
      } else {
        console.error("Erro ao excluir horários:", data.error);
      }
    } catch (error) {
      console.error("Erro ao excluir horários:", error);
    }
  };

  const handleCancelReservation = async (idEspaco, dia, horario) => {
    try {
      const spaceToUpdate = spaces.find((space) => space.id === idEspaco);
      if (!spaceToUpdate) return;

      const updatedHorariosDisponiveis = spaceToUpdate.horarios_disponiveis.map(
        (h) => {
          if (h.dia === dia) {
            return {
              ...h,
              horarios: h.horarios.map((hor) => {
                if (hor.horario === horario) {
                  return { ...hor, disponivel: true, usuario: null };
                }
                return hor;
              }),
            };
          }
          return h;
        }
      );

      const payload = {
        ...spaceToUpdate,
        horarios_disponiveis: updatedHorariosDisponiveis,
      };

      const response = await fetch(
        `http://localhost:3000/espaco/editar-espaco/${idEspaco}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Reserva cancelada com sucesso:", data);
        fetchSpaces();
      } else {
        console.error("Erro ao cancelar reserva:", data.error);
      }
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
    }
  };

  return (
    <Container>
      <NavBar />
      <h2>Gerenciar Espaços</h2>

      <Form onSubmit={handleSubmit} className="form-container">
        <h6>Adicione um Espaço:</h6>
        <Form.Group controlId="formSpaceName">
          <Form.Label>Nome do Espaço</Form.Label>
          <Form.Control
            type="text"
            value={spaceName}
            onChange={handleSpaceNameChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formCapacity">
          <Form.Label>Capacidade</Form.Label>
          <Form.Control
            type="number"
            value={capacity}
            onChange={handleCapacityChange}
            required
          />
        </Form.Group>
        {availability.map((item, index) => (
          <div key={index} className="availability-section">
            <Form.Group controlId={`formDay${index}`}>
              <Form.Label>Dia</Form.Label>
              <Form.Control
                type="date"
                value={item.day}
                onChange={(e) => handleDayChange(index, e.target.value)}
                required
              />
            </Form.Group>
            {item.times.map((time, timeIndex) => (
              <Form.Group
                controlId={`formTime${index}-${timeIndex}`}
                key={timeIndex}
              >
                <Form.Label>Horário</Form.Label>
                <Form.Control
                  type="time"
                  value={time}
                  onChange={(e) =>
                    handleTimeChange(index, timeIndex, e.target.value)
                  }
                  required
                />
                <Button
                  variant="danger"
                  onClick={() => handleRemoveTime(index, timeIndex)}
                  style={{ marginTop: "20px" }}
                >
                  Remover Horário
                </Button>
              </Form.Group>
            ))}
            <Button variant="secondary" onClick={() => handleAddTime(index)}>
              Adicionar Horário
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={handleAddDay}>
          Adicionar Dia
        </Button>
        <Button variant="primary" type="submit">
          Adicionar Espaço
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Espaço</th>
            <th>Capacidade</th>
            <th>Horários Disponíveis</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <tr key={space.id}>
              <td>{space.espaco_nome}</td>
              <td>{space.capacidade} pessoas</td>
              <td>
                {space?.horarios_disponiveis?.map((horario) => (
                  <div>
                    <h5>{horario?.dia}</h5>
                    {horario.horarios.map((h, index) => (
                      <div key={index}>
                        {h?.disponivel ? (
                          <span>{h?.horario} - Disponível</span>
                        ) : (
                          <>
                            <span>
                              {h.horario} - Reservado por {h.usuario.nome}
                            </span>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleCancelReservation(
                                  space.id,
                                  horario.dia,
                                  h.horario
                                )
                              }
                              style={{ marginLeft: "20px" }}
                            >
                              Cancelar Reserva
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </td>
              <td>
                <Button variant="info" onClick={() => handleEditClick(space)} style={{ marginRight: "20px" }}>
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(space)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Espaço</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingSpace && (
            <Form>
              <Form.Group controlId="formEditSpaceName">
                <Form.Label>Nome do Espaço</Form.Label>
                <Form.Control
                  type="text"
                  name="espaco_nome"
                  value={editingSpace.espaco_nome}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEditCapacity">
                <Form.Label>Capacidade</Form.Label>
                <Form.Control
                  type="number"
                  name="capacidade"
                  value={editingSpace.capacidade}
                  onChange={handleInputChange}
                />
              </Form.Group>
              {editingSpace.horarios_disponiveis.map((horario) => (
                <div key={horario.dia}>
                  <h5>{horario.dia}</h5>
                  {horario.horarios.map((h, index) => (
                    <div key={index}>
                      <Form.Group
                        controlId={`formEditTime${horario.dia}-${index}`}
                      >
                        <Form.Label>Horário</Form.Label>
                        <Form.Control
                          type="time"
                          value={h.horario}
                          onChange={(e) =>
                            handleHorarioChange(
                              horario.dia,
                              index,
                              e.target.value
                            )
                          }
                        />
                        <Form.Check
                          type="checkbox"
                          label="Excluir"
                          checked={selectedTimes.includes(
                            `${horario.dia}-${index}`
                          )}
                          onChange={() =>
                            handleCheckboxChange(horario.dia, index)
                          }
                        />
                      </Form.Group>
                    </div>
                  ))}
                </div>
              ))}
              <Button variant="danger" onClick={handleDeleteSelectedTimes}>
                Excluir Selecionados
              </Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSaveClick}>
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza de que deseja excluir o espaço{" "}
          {spaceToDelete && spaceToDelete.espaco_nome}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Manage;
