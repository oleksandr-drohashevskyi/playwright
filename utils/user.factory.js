export const makeUniqueUser = () => {
  const ts = Date.now();
  const rnd = Math.random().toString(16).slice(2);

  return {
    firstName: "Alex",
    lastName: "Test",
    email: `aqa+${ts}.${rnd}@gmail.com`,
    password: "Abcdefg1", // 8..15, 1 digit, 1 upper, 1 lower
  };
};
