import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      
      const senhaCriptografada = CryptoJS.AES.encrypt(
        senha,
        "chave_secreta"
      ).toString();
      const response = await fetch(
        `http://localhost:3000/usuarios/login?email=${email}&senha=${senhaCriptografada}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao fazer login");
      }

      const data = await response.json();
      setMensagem("Login bem-sucedido!");
      localStorage.setItem("usuarioLogado", true);
      localStorage.setItem("nomeUsuario", data?.data?.nome);
      localStorage.setItem("idUsuario", data?.data?.id);
      localStorage.setItem("filmes_assistidos", [
        data?.data?.filmes_assistidos,
      ]);
      navigate("/filmes");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMensagem("Nome de usuário ou senha incorretos");
    }
  };

  return (
    <div className="container-adicionar">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNome">
          <Form.Label>Usuário</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite seu email de usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formSenha">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Entrar
        </Button>
      </Form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default LoginForm;
