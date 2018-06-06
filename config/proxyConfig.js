module.exports = {
    proxy: {
        '/protected': {
            target: 'http://new.jiguo.com',
            secure: true,
            changeOrigin: true
        },
        '/admin': {
            target: 'http://qyb.jiguo.com',
            secure: true,
            changeOrigin: true
        },
        '/asyn': {
            target: 'http://qyb.jiguo.com',
            secure: true,
            changeOrigin: true
        }
    }
}