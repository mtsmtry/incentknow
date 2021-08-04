var editorMap = {};

function convertData(data) {
    try {
        return JSON.parse(data);
    } catch(e) {
        return { blocks: [ { type: "paragraph", data: { text: data } } ] };
    }
}

exports.initEditor = id => {
    return setting => {
        return onChange => {
            return () => {
                const data = convertData(setting.data);

                console.log("initEditor");
                console.log(data);
                editorMap[id] = new EditorJS({
                    data: data,
                    readOnly: setting.readonly,
                    holder: id,
                    tools: { 
                        header: Header, 
                        list: List,
                        checklist: Checklist,
                        quote: Quote,
                        embed: Embed
                    },
                    onChange: () => {
                        const editor = editorMap[id];
                        editor.save().then(savedData => {
                            console.log(savedData);
                            onChange(JSON.stringify(savedData))();
                        });
                    } /*(() => {
                        return async function() {
                            const editor = editorMap[id];
                            const savedData = await editor.save();
                            console.log(savedData);
                            onChange(savedData)();
                    }})()*/
                });
            };
        };
    };
};

exports.setDataEditor = (() => {
    return id => {
        return async function (data) {
            if (data.length == 0) {
                return;
            }

            data = convertData(data);

            const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

            console.log("setDataEditor");
            console.log(data);

            const editor = editorMap[id];
            if (!editor) {
                return;
            }
            while(!editor.blocks) {
                await sleep(50);
            }
            await editor.blocks.render(data);
        }
    };
})();