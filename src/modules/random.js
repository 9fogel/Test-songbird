function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

export const getRandomArr = () => {
  let arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push(getRandomIntInclusive(0, 5));
  }
  return arr;
}