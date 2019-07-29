module.exports = function fixMatter() {
    global.document = {
        createElement: function () {
            return {
                getContext: function () { return {}; }
            };
        }
    };
    global.window = {};
    this.options = {
        render: {
            element: null,
            controller: {
                create: function () { },
                clear: function () { },
                world: function () { }
            }
        },
        input: { mouse: {} }
    };
}