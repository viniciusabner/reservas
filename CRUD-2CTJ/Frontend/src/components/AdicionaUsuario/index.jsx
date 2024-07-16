import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

function AdicionarUsuarioForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/usuarios/adicionar-usuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nome, email, senha }),
        }
      );

      const data = await response.json();
      if (!data.error) {
        setMensagem(
          "Usuario cadastrado com sucesso! Faça login para continuar"
        );
      } else {
        setMensagem(data.error);
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
    }
  };

  return (
    <div className="container-adicionar">
      <div>
        <h2>Cadastrar Usuário</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNome">
            <Form.Label>Nome:</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formSenha">
            <Form.Label>Senha:</Form.Label>
            <Form.Control
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Adicionar Usuário
          </Button>
        </Form>
        {mensagem && <p>{mensagem}</p>}
      </div>
    </div>
  );
}

export default AdicionarUsuarioForm;
