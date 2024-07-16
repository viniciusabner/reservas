import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";

const Reserve = () => {
  const [spaces, setSpaces] = useState([]);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

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
            // dia: new Date(horario.dia).toLocaleDateString("pt-BR", {
            //   day: "2-digit",
            //   month: "2-digit",
            //   year: "numeric",
            // }),
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

  const handleReserveChange = (idEspaco, dia, horario) => {
    setSelectedReservations((prev) => {
      const updatedReservations = [...prev];
      const existingIndex = updatedReservations.findIndex(
        (res) =>
          res.idEspaco === idEspaco &&
          res.dia === dia &&
          res.horario === horario
      );
      if (existingIndex > -1) {
        updatedReservations.splice(existingIndex, 1);
      } else {
        updatedReservations.push({ idEspaco, dia, horario });
      }
      return updatedReservations;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const reservation of selectedReservations) {
        const space = spaces.find((s) => s.id === reservation.idEspaco);
        if (!space) continue;

        // Update availability and user data
        space.horarios_disponiveis.forEach((h) => {
          if (h.dia === reservation.dia) {
            h.horarios.forEach((hr) => {
              if (hr.horario === reservation.horario && hr.disponivel) {
                hr.disponivel = false;
                hr.usuario = { nome: name, email: email, telefone: telefone };
              }
            });
          }
        });

        const response = await fetch(
          `http://localhost:3000/espaco/editar-espaco/${space.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(space),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Erro ao reservar espaço");
        }
      }
      fetchSpaces();
      setSelectedReservations([]);
      setName("");
      setEmail("");
      setTelefone("");
    } catch (error) {
      console.error("Erro ao adicionar reserva:", error);
    }
  };

  const isFormValid = name && email && telefone;

  return (
    <Container>
      <h2>Reservar Horários</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formTelefone">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </Form.Group>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Espaço</th>
              <th>Capacidade</th>
              <th>Horários Disponíveis</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map((space) => (
              <tr key={space.id}>
                <td>{space.espaco_nome}</td>
                <td>{space.capacidade} pessoas.</td>
                <td>
                  {space.horarios_disponiveis.map((horario) => (
                    <div key={horario.dia}>
                      <h5>{horario.dia}</h5>
                      {horario.horarios.map((h, index) => (
                        <div key={index}>
                          <Form.Check
                            type="checkbox"
                            label={`${h.horario} - ${
                              h.disponivel ? "Disponível" : "Reservado"
                            }`}
                            disabled={!h.disponivel}
                            onChange={() =>
                              handleReserveChange(
                                space.id,
                                horario.dia,
                                h.horario
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" type="submit" disabled={!isFormValid}>
          Reservar
        </Button>
      </Form>
    </Container>
  );
};

export default Reserve;
