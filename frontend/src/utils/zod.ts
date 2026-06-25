export const messageMinZod = (i: number, field: string) => {
  return {
    message: `${field} minimal ${i} karakter`,
  };
};

export const messageMaxZod = (i: number, field: string) => {
  return {
    message: `${field} maksimal ${i} karakter`,
  };
};

export const messageEmailZod = () => {
  return {
    message: "email tidak valid",
  };
};
