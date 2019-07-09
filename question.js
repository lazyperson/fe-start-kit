module.exports = {
    template: function (choices) {
        return [{
            name: 'template',
            type: 'list',
            message: '请选择框架类型',
            choices
        }];
    },
    preCssType: function (choices) {
        return [{
            name: 'preCssType',
            type: 'list',
            message: '请选择css预处理语言',
            choices
        }];
    },
    mulQuestion: [{
        name: 'description',
        message: '请输入项目描述'
    },
    {
        name: 'keywords',
        message: '请输入项目关键字'
    },
    {
        name: 'author',
        message: '请输入作者名称'
    },
    {
        name: 'version',
        message: '请输入version',
        default: '1.0.0'
    },
    {
        name: 'license',
        message: '请输入license',
        default: 'MIT'
    }]
}



