export default function flipObject(obj) {
  const result = {};

  Object.entries(obj).forEach(([key, values]) => {
    Object.entries(values).forEach(([innerKey, value]) => {
      if (!result[innerKey]) {
        result[innerKey] = {};
      }

      result[innerKey][key] = value;
    });
  });

  return result;
}
