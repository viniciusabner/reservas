const supabase = require("../config/config");
const CryptoJS = require("crypto-js");

exports.adicionarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "É necessário fornecer o nome, email e senha." });
    }

    const { data: existingUser, error: userError } = await supabase
      .from("Autenticação")
      .select("*")
      .eq("email", email);

    if (userError) {
      throw userError;
    }

    if (existingUser && existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Já existe um usuário com esse email." });
    }

    const { data, error } = await supabase
      .from("Autenticação")
      .insert([{ nome, email, senha }])
      .select();

    if (error) {
      throw error;
    }

    res.json({ data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.query;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ error: "É necessário fornecer o email e a senha." });
    }

    const senhaDescriptografada = await descriptografarSenha(senha);

    const { data, error } = await supabase
      .from("Autenticação")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw error;
    }

    if (data?.senha !== senhaDescriptografada) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    res.json({ data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function descriptografarSenha(senha) {
  const bytes = CryptoJS.AES.decrypt(senha, "chave_secreta");
  return bytes.toString(CryptoJS.enc.Utf8);
}

exports.carregarFilmesAssistidos = async (req, res) => {
  try {
    const idUsuario = req.query.id;

    const { data: perfilUsuario, error: filmesError } = await supabase
      .from("Autenticação")
      .select("*")
      .eq("id", idUsuario);

    if (filmesError) {
      throw filmesError;
    }
    const filmesAssistidos = perfilUsuario[0]?.filmes_assistidos || [];
    res.json({ filmesAssistidos });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.adicionarFilmeAssistido = async (req, res) => {
  try {
    const { idUsuario, idFilme } = req.body;
    const { data: perfilUsuario, error: filmesError } = await supabase
      .from("Autenticação")
      .select("filmes_assistidos")
      .eq("id", idUsuario);

    if (filmesError) {
      throw filmesError;
    }

    let filmesAssistidosArray = perfilUsuario[0]?.filmes_assistidos || [];

    if (!filmesAssistidosArray.includes(idFilme)) {
      filmesAssistidosArray.push(idFilme);
    }

    const { data: updateData, error: updateError } = await supabase
      .from("Autenticação")
      .update({ filmes_assistidos: filmesAssistidosArray })
      .eq("id", idUsuario);

    if (updateError) {
      throw updateError;
    }

    res.json({ data: updateData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletarFilmeAssistido = async (req, res) => {
  try {
    const { idUsuario, idFilme } = req.body;

    const { data: perfilUsuario, error: filmesError } = await supabase
      .from("Autenticação")
      .select("filmes_assistidos")
      .eq("id", idUsuario);

    if (filmesError) {
      throw filmesError;
    }

    let filmesAssistidosArray = perfilUsuario[0]?.filmes_assistidos || [];

    filmesAssistidosArray = filmesAssistidosArray.filter(
      (filmeId) => filmeId !== idFilme
    );

    const { data: updateData, error: updateError } = await supabase
      .from("Autenticação")
      .update({ filmes_assistidos: filmesAssistidosArray })
      .eq("id", idUsuario);

    if (updateError) {
      throw updateError;
    }

    res.json({ data: updateData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
