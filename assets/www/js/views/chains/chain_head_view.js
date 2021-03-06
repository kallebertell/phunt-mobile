
define(["modules/views", "modules/config", "modules/navigation"], function(views, config, navigation) {

    var WIN_WIDTH = config.win.width;
    var HOR_DOMINANCE = config.win.horDominance;

    var ChainHeadView = views.base.extend({

        className: 'ph-chainHead',

        events: {
            'fastclick': function() {

                if (this.parentCategoryView.isCurrentlyFocused && this.isCurrentlyFocused)
                    navigation.go('location', this.model.get('resourceUrl'));
                else if (this.parentCategoryView.isCurrentlyFocused)
                    this.parentCategoryView.focusChainHeadAnimated(this.model);
                else
                    this.parentCategoryView.parentCategoryCollectionView.focusCategory(this.parentCategoryView);

            }
        },

        initialize: function(options) {

            this.index = options.index;
            this.parentCategoryView = options.parentCategoryView;
            this.$el.css({
                width: (WIN_WIDTH * HOR_DOMINANCE) + 'px',
                left: options.parentCategoryView.getLeftForIndex(this.index) + 'px'
            });

            this.$el.append($('<div class="ph-roughDistance ph-title"></div>'));

            this.addFastButtons();

        },

        prepareForModel: function(chainHead) {

            if (chainHead) {

                this.$el.addClass('ph-populated');
                this.$el.find('.ph-roughDistance').text('loading');

            } else {

                this.$el.removeClass('ph-populated');
                this.$el.find('.ph-roughDistance').text('');

            }

        },

        attachToModel: function(chainHead) {

            if (!chainHead)
                return; // it's OK, we didn't want a new model anyway

            var that = this;

            this.model = chainHead;

            this.$el.addClass('ph-populated');
            this.$el.css({ backgroundImage: 'url("' + this.model.get('gridPictureUrl') + '")' });
            this.$el.find('.ph-roughDistance').text(this.model.get('roughDistance'));

            // Just in case
            this.model.off('change');

            this.model.on('change', function() {
                that.$el.css({ backgroundImage: 'url("' + that.model.get('gridPictureUrl') + '")' });
                that.$el.find('.ph-roughDistance').text(that.model.get('roughDistance'));
            });

        },

        detachFromModel: function() {

            if (!this.model)
                return; // already detached or never attached

            this.model.off('change');
            this.model = null;

            this.$el.css({ backgroundImage: 'url("img/empty.png")' }); // we actually have to set a new image here to clear the background on Android
            this.$el.find('.ph-roughDistance').text('');


        }

    });

    return ChainHeadView;

});