
function getOffset(node) {
    let rangeCount = 0;
    const childNodes = node.parentNode.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] == node) {
            break;
        }
        if (childNodes[i].outerHTML)
            rangeCount += childNodes[i].outerHTML.length;
        else if (childNodes[i].nodeType == 3) {
            rangeCount += childNodes[i].textContent.length;
        }
    }
    return rangeCount;
}

function getBlockIdAndNode(node) {
    let blockId = null;
    for (let i = 0; i < 10; i++) {
        blockId = node.getAttribute ? node.getAttribute("data-id") : null;
        if (!blockId) {
            node = node.parentNode;
        } else {            
            return { blockId, index: getBlockIndex(node) };
        }
    }
}

function getBlockIndex(node) {
    let i = 0;
    for(let child of node.parentNode.childNodes) {
        if (child == node) {
            return i;
        }
        i++;
    }
    return -1;
}

exports.getSelection = () => {
    const selection = window.getSelection();
    let range = window.getSelection().getRangeAt(0);
    const start = getBlockIdAndNode(selection.anchorNode);
    const end = getBlockIdAndNode(selection.focusNode);
    const result = { 
        startBlockId: start.blockId,
        startOffset: range.startOffset + getOffset(selection.anchorNode),
        endBlockId: end.blockId,
        endOffset: range.endOffset + getOffset(selection.focusNode),
    };

    if (start.index > end.index) {
        const startBlockId = result.startBlockId;
        const startOffset = result.startOffset;
        result.startBlockId = result.endBlockId;
        result.startOffset = result.endOffset;
        result.endBlockId = startBlockId;
        result.endOffset = startOffset;
    }

    if (result.startBlockId == result.endBlockId && result.startOffset > result.endOffset) {
        const startOffset = result.startOffset;
        result.startOffset = result.endOffset;
        result.endOffset = startOffset;
    }

    return result;
};

function getEditable(element) {
    if (element.getAttribute && element.getAttribute("data-editable")) {
        return element;
    }
    if (element.childNodes) {
        for (const child of element.childNodes) {
            const editable = getEditable(child);
            if (editable) {
                return editable;
            }
        }
    }
    return null;
}

exports._setCaret = blocksElement => blockId => offset => () => {
    for (const block of blocksElement.childNodes) {
        if (block.getAttribute("data-id") != blockId) {
            continue;
        }
        let editable = getEditable(block);
        if (!editable) {
            return;
        }
        editable = editable.childNodes.length > 0 ? editable.childNodes[0] : editable;
        
        var range = document.createRange();
        range.setStart(editable, offset);
        range.setEnd(editable, offset);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

exports.getBlockText = blocksElement => blockId => () => {
    for (const block of blocksElement.childNodes) {
        if (block.getAttribute("data-id") != blockId) {
            continue;
        }
        const editable = getEditable(block);
        if (!editable) {
            return;
        }
        
        let innerText = editable.innerText.replace(/&nbsp;/g, " ")
        return innerText;
    }
}