
const fs = require("fs");
const icons = require("/Users/ryoui/Dropbox/Solutions/IncentknowPureScript/frontend/fontawesome/icons.json");

const result = [];

Object.keys(icons).forEach(key => {
    const icon = icons[key];
    if (icon.search.terms.length > 0 && icon.styles.includes("solid")) {
        result.push({
            searchwords: icon.search.terms,
            name: key,
            label: icon.label
        });
    }
});

const data = JSON.stringify(result);
fs.writeFile("public/assets/fontawesome.json", data, () => {});