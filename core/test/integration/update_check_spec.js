var testUtils   = require('../utils'),
    should      = require('should'),
    rewire      = require('rewire'),

    // Stuff we are testing
    packageInfo = require('../../../package'),
    updateCheck = rewire('../../server/update-check');

describe('Update Check', function () {
    var environmentsOrig;

    before(function () {
        environmentsOrig = updateCheck.__get__('allowedCheckEnvironments');
        updateCheck.__set__('allowedCheckEnvironments', ['development', 'production', 'testing']);
    });

    after(function () {
        updateCheck.__set__('allowedCheckEnvironments', environmentsOrig);
    });

    beforeEach(testUtils.setup('owner', 'posts', 'perms:setting', 'perms:user', 'perms:init'));

    afterEach(testUtils.teardown);

    it('should report the correct data', function (done) {
        var updateCheckData = updateCheck.__get__('updateCheckData');

        updateCheckData().then(function (data) {
            should.exist(data);
            data.ghost_version.should.equal(packageInfo.version);
            data.node_version.should.equal(process.versions.node);
            data.env.should.equal(process.env.NODE_ENV);
            data.database_type.should.match(/sqlite3|pg|mysql/);
            data.blog_id.should.be.a.String();
            data.blog_id.should.not.be.empty();
            data.theme.should.be.equal('casper');
            data.apps.should.be.a.String();
            data.blog_created_at.should.be.a.Number();
            data.user_count.should.be.above(0);
            data.post_count.should.be.above(0);
            data.npm_version.should.be.a.String();
            data.npm_version.should.not.be.empty();

            done();
        }).catch(done);
    });
});
