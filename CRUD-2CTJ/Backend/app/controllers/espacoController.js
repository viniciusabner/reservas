const supabase = require("../config/config");

exports.criarEspaco = async (req, res) => {
  try {
    const { espaco_nome, capacidade, horarios_disponiveis, usuario } = req.body;

    const { data, error } = await supabase
      .from("reservas")
      .insert([
        {
          espaco_nome,
          capacidade,
          horarios_disponiveis,
          usuario,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    res.json({ data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarEspacos = async (req, res) => {
  try {
    const { data: reservas, error } = await supabase
      .from("reservas")
      .select("*");

    if (error) {
      throw error;
    }

    res.json({ reservas });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Editar espaço
exports.editarEspaco = async (req, res) => {
  try {
    const { id } = req.params;
    const { espaco_nome, capacidade, horarios_disponiveis, usuario } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do espaço é obrigatório." });
    }

    const { data, error } = await supabase
      .from("reservas")
      .update({
        espaco_nome,
        capacidade,
        horarios_disponiveis,
        usuario,
      })
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    res.json({ data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.reservarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia, horario, usuario } = req.body;

    if (!id || !dia || !horario || !usuario) {
      return res.status(400).json({
        error: "ID do espaço, dia, horário e usuário são obrigatórios.",
      });
    }

    const { data: reservas, error } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", id);

    if (error) {
      throw error;
    }

    if (reservas.length === 0) {
      return res.status(404).json({ error: "Espaço não encontrado" });
    }

    const reserva = reservas[0];

    let horarioEncontrado = false;
    reserva.horarios_disponiveis.forEach((h) => {
      if (h.dia === dia) {
        h.horarios.forEach((hr) => {
          if (hr.horario === horario && hr.disponivel) {
            hr.disponivel = false;
            hr.usuario = usuario;
            horarioEncontrado = true;
          }
        });
      }
    });

    if (!horarioEncontrado) {
      return res
        .status(404)
        .json({ error: "Horário não disponível para reserva" });
    }

    const { data: updatedData, updateError } = await supabase
      .from("reservas")
      .update(reserva)
      .eq("id", reserva.id)
      .select();

    if (updateError) {
      throw updateError;
    }

    res.json({ data: updatedData });
  } catch (error) {
    console.error("Erro ao reservar espaço:", error);
    res.status(500).json({ error: "Erro ao reservar espaço" });
  }
};

listarHorariosDisponiveis = async (req, res) => {
  try {
    let { data: reservas, error } = await supabase.from("reservas").select("*");

    if (error) {
      throw error;
    }

    // Filtrando apenas horários disponíveis
    const horariosDisponiveis = reservas.map((reserva) => ({
      dia: reserva.dia,
      horarios: reserva.horarios.filter((h) => h.disponivel),
    }));

    res.json({ horariosDisponiveis });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.excluirEspaco = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("reservas") // Substitua 'reservas' pelo nome da tabela no seu banco de dados
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    res.json({ data }); // Responde com os dados do espaço excluído, se necessário
  } catch (error) {
    console.error("Erro ao excluir espaço:", error.message);
    res.status(500).json({ error: "Erro ao excluir espaço" });
  }
};

exports.excluirHorarios = async (req, res) => {
  try {
    const { id } = req.params;
    const { horariosExcluir } = req.body;

    const espaco = await Espaco.findById(id);

    if (!espaco) {
      return res.status(404).json({ error: "Espaço não encontrado" });
    }

    espaco.horarios_disponiveis.forEach((dia) => {
      dia.horarios = dia.horarios.filter((horario, index) => {
        const key = `${dia.dia}-${index}`;
        return !horariosExcluir.includes(key);
      });
    });

    await espaco.save();

    res.json({ message: "Horários excluídos com sucesso", data: espaco });
  } catch (error) {
    console.error("Erro ao excluir horários:", error);
    res.status(500).json({ error: "Erro interno ao excluir horários" });
  }
};
