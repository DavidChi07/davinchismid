const validar = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);

  if (!resultado.success) {
    // Zod 4 usa .issues en lugar de .errors
    const errores = resultado.error.issues.map(e => ({
      campo: e.path.join('.'),
      mensaje: e.message
    }));

    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: errores
    });
  }

  req.body = resultado.data;
  next();
};

module.exports = validar;