/* OPT-126692 START */
(function () {
    'use strict';

    const builderId = 282;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const addToCartText = 'Agregar al carrito';

    const classes = {
        addToCartButtonArea: `ins-add-to-cart-button-area-${ variationId }`,
        addToCartButton: `ins-add-to-cart-button-${ variationId }`,
        hideElement: `ins-hide-element-${ variationId }`,
        goal: `sp-custom-${ variationId }`,
        style: `ins-custom-style-${ variationId }`
    };

    const selectors = Object.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        partnerAddToCartButton: 'button[aria-label="Open"]:contains(Agregar al carrito):visible',
        plusButton: 'button[aria-label="+"]',
        cartContainer: '#cart-container',
        buyContainer: '.buy:visible',
    });

    self.init = () => {
        if (Insider.systemRules.call('isOnProductPage')) {
            if (!Insider.campaign.userSegment.isControlGroup(variationId)) {
                self.showCampaign();
            }

            return true;
        }

        return false;
    };

    self.showCampaign = () => {
        Insider.fns.onElementLoaded(selectors.buyContainer, () => {
            self.reset();

            setTimeout(() => {
                self.addClasses();
                self.buildCSS();
                self.buildHTML();
                self.setEvents();
            }, 750);
        }).listen();
    };

    self.reset = () => {
        const { addToCartButton, style, buyContainer, partnerAddToCartButton } = selectors;
        const { addToCartButtonArea, goal } = classes;

        Insider.dom(`${ addToCartButton }, ${ style }`).remove();

        Insider.dom(buyContainer).removeClass(addToCartButtonArea);
        Insider.dom(partnerAddToCartButton).removeClass(goal);
    };

    self.addClasses = () => {
        const { addToCartButtonArea, goal } = classes;
        const { buyContainer, partnerAddToCartButton } = selectors;

        Insider.dom(buyContainer).addClass(addToCartButtonArea);
        Insider.dom(partnerAddToCartButton).addClass(goal);
    };

    self.buildCSS = () => {
        const { addToCartButton, addToCartButtonArea } = selectors;

        const style =
        `${ addToCartButton } {
            background-color: #FF3C00;
            width: 180px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            color: #fff;
            font-size: 16px;
            font-weight: 700;
            border-radius: 20px;
			margin-left: -45px;
        }
        ${ addToCartButtonArea } {
            position: fixed;
            bottom: 0px;
            left: 0;
            background-color: #fff;
            padding: 25px 0px 32px 0px;
            flex-direction: row !important;
            justify-content: center;
            gap: 10px;
            width: 100%;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(style).appendTo('body');
    };

    self.setEvents = () => {
        const { plusButton, partnerAddToCartButton, addToCartButton, cartContainer } = selectors;

        Insider.eventManager.once(`touchstart.partner:addToCart:button:${ variationId }`,
            partnerAddToCartButton, () => {
                Insider.fns.onElementLoaded(plusButton, () => {
                    setTimeout(() => {
                        self.buildHTML();
                    }, 500);
                }).listen();
            });

        Insider.eventManager.once(`touchstart.add:to:cart:button:${ variationId }`, addToCartButton, () => {
            setTimeout(() => {
                Insider.dom(plusButton).click();
            }, 100);
        });

        Insider.fns.onElementLoaded(cartContainer, () => {
            self.showCampaign();
        }).listen();

        Insider.fns.onElementLoaded(partnerAddToCartButton, () => {
            Insider.dom(addToCartButton).remove();
        }).listen();
    };

    self.buildHTML = function () {
        const { addToCartButton, goal } = classes;

        const html = `<div class="${ addToCartButton } ${ goal }">+&nbsp;&nbsp;${ addToCartText }</div>`;

        !Insider.dom(selectors.addToCartButton).exists() && Insider.dom(selectors.addToCartButtonArea).prepend(html);
    };

    return self.init();
})({});
/* OPT-126692 END */