exports.imgToBase64 = function(img) {
    return new Promise((resolve, reject) => {
        if (!img instanceof Image) reject(new Error('параметром должен быть Image'));
        var reader = new FileReader();
        reader.onload = function(event) {
            var dataUri = event.target.result;
            resolve(dataUri);
        };
        reader.onerror = function(event) {
            reject(new Error("файл не может быть прочитан"));
        };
        reader.readAsDataURL(img);
    });
}