const info = require('../../serv').info;

exports.getMainInfo = function() {
    let menuInfo = {};
    let commandsInfo = {};
    return new Promise((resolve, reject) => {
        info.getSession('colorScheme')
            .then((answer) => {
                if (answer.success === false)
                    return Promise.reject(new Error('не удалось получить параметр colorScheme'));
                menuInfo.isDarkScheme = answer.value === 'dark' ? true : false;
                return Promise.resolve();
            })
            .then(info.getRoleId)
            .then((roleId) => {
                commandsInfo.roleId = roleId;
                resolve({ menuInfo, commandsInfo });
            })
            .catch((err) => reject(err));
    });
}

exports.Command = class Command {
    constructor(methods) {
        this.map = new Map();
        methods.forEach((method, ind) => {
            this.map.set(ind, method);
        });
    }

    hasMethod(ind) {
        return this.map.has(Number(ind));
    }

    getMethod(ind) {
        return this.map.get(Number(ind));
    }

    static executeMethod(self, command, ind, params) {
        return new Promise((resolve, reject) => {
            if (command.hasMethod(ind)) {
                self[command.getMethod(ind)](params)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            } else reject(new Error('Команды с таким индексом не существует = ' + ind));
        });
    }
}