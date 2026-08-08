const successResponse = (
  res,
  { status = 200, message = "Success", data = null, meta = null } = {},
) => {
  const response = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (meta !== undefined) {
    response.meta = meta;
  }

  return res.status(status).json(response);
};

export default successResponse;
