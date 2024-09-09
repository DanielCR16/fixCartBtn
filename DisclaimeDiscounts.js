/* OPT-135913 START */
((self) => {
    'use strict';

    const isMobile = Insider.browser.isMobile();
    const builderId = isMobile ? 333 : 332;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        productContainer: `ins-product-container-${ variationId }`,
        emojiContainer: `ins-emoji-container-${ variationId }`,
        textContainer: `ins-text-container-${ variationId }`,
        cartContainer: `ins-cart-container-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        buyButton: '.buy',
        miniCart: '.styles__CartFooter-sc-hqvcqa-0'
    });

    const config = {
        text: 'Los descuentos de algunos productos se verán reflejados en el resumen del pedido',
        emoji: '&#9757;'
    };

    self.init = () => {
        const { cartSide, miniCart } = selectors;

        if (variationId) {
            Insider.eventManager.once(`cart:amount:update.check:cart:${ variationId }`, () => {
                if (!Insider.dom(cartSide).exists() && Insider.dom(miniCart).exists()) {
                    self.showAlert(true);

                    Insider.campaign.custom.show(variationId);
                }
            });

            if (Insider.systemRules.call('isOnProductPage')) {
                self.showAlert(false);

                return true;
            }
        }
    };

    self.showAlert = (isItForCart) => {
        if (!Insider.campaign.isControlGroup(variationId)) {
            self.reset(isItForCart);
            self.setCSS();
            self.buildHTML(isItForCart);
        }
    };

    self.reset = (isItForCart) => {
        const { productContainer, cartContainer, style } = selectors;

        Insider.dom(`${ isItForCart ? cartContainer : productContainer }, ${ style }`).remove();
    };

    self.setCSS = () => {
        const { productContainer, emojiContainer, textContainer, cartContainer } = selectors;

        const styleText =
        `${ productContainer } {
            padding: 4%;
            padding-left: 0;
            display: flex;
            background: #F2FCF8;
            border: 1px solid #008656;
            border-radius: 9px; 
            margin-top: 20px;
        }
        ${ emojiContainer } {
            margin-top: 4px;
            width: 80px;
            font-size: 25px;
            text-align: center;
        }
        ${ textContainer } {
            color: #006D3E;
            font-size: 14px;
            letter-spacing: -4.5%;
            font-weight: normal;
            font-family: 'Inter', sans-serif;
        }
        ${ cartContainer } {
            padding: 4%;
            padding-left: 0;
            display: flex;
            background: #F2FCF8;
            border: 1px solid #008656;
            border-radius: 9px; 
            margin: 20px;
        }
        ${ cartContainer } ${ emojiContainer } {
            width: 30% !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(styleText).appendTo('head');
    };
    self.buildHTML = (isItForCart) => {
        const { productContainer, emojiContainer, textContainer, join, cartContainer } = classes;
        const { buyButton, miniCart } = selectors;
        const { text, emoji } = config;

        const popupHtml =
        `<div class="${ join } ${ isItForCart ? cartContainer : productContainer }">
            <div class="${ emojiContainer }">${ emoji }</div>
            <div class="${ textContainer }">${ text }</div>
        </div>`;

        Insider.dom(isItForCart ? miniCart : buyButton).before(popupHtml);
    };

    return self.init();
})({});
/* OPT-135913 END */