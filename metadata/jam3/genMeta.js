const fs = require("fs").promises;

(async () => {
  const arr = [];
  for (let i = 0; i++; i < 188) {
    arr.push({
      id: i,
      file: `${i}.jpg`,
      name: `#${i}`,
      description: `Jam3 Variant ${i}`,
    });
  }

  await fs.writeFile(`./tokens-metadata.json`, JSON.stringify(arr));
})();
