exports.offsetAndFetch = ({ pageNum, rowCount }) => {
    console.log(`calcOffsetAndFetch: rowCount = ${rowCount}, pageNum = ${pageNum}`);
    return new Promise((resolve, reject) => {
        if (!rowCount || rowCount <= 0 || !pageNum || pageNum <= 0)
            reject(new Error('calcOffsetAndFetch params error'));
        let offset = (pageNum - 1) * rowCount;
        let fetch = rowCount;
        console.log(`calcOffsetAndFetch: offset = ${offset}, fetch = ${fetch}`);
        resolve({ fetch: fetch, offset: offset });
    });
}