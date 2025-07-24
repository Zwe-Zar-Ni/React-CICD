module.exports = {
    extends : [],
    rules : {
        "header-min-length" : [2, "always", 20],
        "header-case-start-capital" : [2, "always"],
        "header-end-period" : [2, "always"],
    },
    plugins : [
        {
            rules : {
                "header-case-start-capital" : ({raw}) => {
                    return [
                        /[A-Z]/.test(raw),
                        "Header must start with capital letter"
                    ]
                }
            }
        }
    ]
}