class Users {
    constructor() {
        this.users = [];
    }

    addUser (id, name, room) {
        const user = {id, name, room};
        this.users.push(user);
        return user; 
    }

    removeUser (id) {
        const user = this.getUser(id); 
        if (user) {
            this.users = this.users.filter(u => u.id !== id);
        }
        return user;
    }

    getUser(id) {
        return this.users.filter(u => u.id === id)[0];
    }

    getUserList (room) {
        const users = this.users.filter(u => u.room === room);
        let namesArray = users.map(u => u.name);
        return namesArray;
    }
}
module.exports = {Users}