document.addEventListener("DOMContentLoaded", async () => {
    let ONE_MINUTE = 60 * 1000;
    let ONE_HOUR = ONE_MINUTE * 60;
    let screenSize = window.innerWidth;
    let pWidth = 0;
    if (screenSize >= 768) {
        pWidth = pWidthPCScreen;
    } else {
        pWidth = pWidthMobileScreen;
    }

    let pBannerIndex = 0;

    if (typeof iconFollowLink !== 'undefined' && iconFollowLink == true) {
        pBannerIndex = (pGetLog("pUrlIndex") != undefined) ? (parseInt(pGetLog("pUrlIndex")) + 1) : 0;
        if (pBannerIndex >= pBanners.length) {
            pBannerIndex = 0;
        }
    } else {
        console.log(typeof iconFollowLink);
        pBannerIndex = Math.floor(Math.random() * pBanners.length);
    }

    let iconP = 50;

    if (typeof iconPosition !== 'undefined') {
        iconP = iconPosition;
    }

    let popupHTML = `
    <div id="pvoucher-live-container" style="position: fixed; top: ${iconP}%; right: 8px; transform: translateY(-50%)">
            <div class="position: relative;">
                <div id="pvoucher-live-close" style="position: absolute; top: -20px; right: 0; background-color: #ffffff; border: 1px solid #bbbbbb; width: fit-content; display: inline; border-radius: 50%; padding: 3px 6px; font-size: 12px; font-weight: 600; cursor: pointer; line-height: initial;">
                    &#10006;
                </div>
                <div id="pvoucher-live-icon" style="width: ${pWidth}px; cursor: pointer;">
                    <img src="${pBanners[pBannerIndex] == '' ? 'https://d22k0f5x9iaayd.cloudfront.net/adpia.vn/util/upload_document/20230929/voucher_live_snhxhw.png' : pBanners[pBannerIndex]}" alt="" style="width: 100%;">
                </div>
            </div>
        </div>
    `;

    let timeNow = new Date().getTime();
    let preEndLifeCircleTime = pGetLog("pEndLifeCircleTime");

    if (preEndLifeCircleTime != undefined) {
        if(await isRestDone(timeNow, preEndLifeCircleTime)) {
            document.body.insertAdjacentHTML('beforeend', popupHTML);
        }
    } else {
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }

    if (document.querySelector('#pvoucher-live-icon') != null) {
        document.querySelector('#pvoucher-live-icon').addEventListener('click', () => {
            handlePopupProcess();
        });
    }

    function pDeeplink(url) {
        objectURL = new URL(url);
        if (
            // ignore case
            objectURL.host != "click.adpia.vn"
            && objectURL.host != "adpvn.co"
            && objectURL.host != "adpvn.top"
        ) {
            return `https://rutgon.me/v0/${pAffiliateId}?url=${encodeURIComponent(url)}`;
        } else {
            return url;
        }
    }

    function pSetLog(name, value) {
        localStorage.setItem(name, value);
    }

    function pGetLog(name) {
        return localStorage.getItem(name);
    }

    function isRestDone(timeNow, preEndLifeCircleTime) {
        return (timeNow - preEndLifeCircleTime) > (pLoopTimeHours * ONE_HOUR);
    }

    function isLastIndex(index) {
        return index == (pUrls.length - 1);
    }

    function pHiddenContainer() {
        document.querySelector('#pvoucher-live-container').style.display = 'none';
    }

    async function handleOpenTab(timeNow, pClose) {
        let pPreIndex = pGetLog("pUrlIndex");
        let pIndex = 0;

        if (typeof iconFollowLink !== 'undefined' && iconFollowLink == true) {
            if (getBannerIndex() != pPreIndex) {
                pIndex = parseInt(pPreIndex) + 1;
            } else {
                pIndex = parseInt(pPreIndex);
            }
        } else {
            pIndex = parseInt(pPreIndex) + 1;
        }

        if (pIndex >= pUrls.length) {
            pIndex = 0;
        }

        if(await isLastIndex(pIndex)) {
            pSetLog("pEndLifeCircleTime", timeNow);
            pHiddenContainer();
        }

        pSetLog("pUrlIndex", pIndex);
        pIncludeClose = false;
        window.open(pDeeplink(pUrls[pIndex]), "_blank", 'noopener');
    }

    if (document.querySelector('#pvoucher-live-close') != null) {
        document.querySelector('#pvoucher-live-close').addEventListener('click', () => {
            if (pIncludeClose) {
                handlePopupProcess(true);
            } else {
                pHiddenContainer();
            }
        });
    }

    async function handlePopupProcess(pClose = false) {
        let timeNow = new Date().getTime();
        let preEndLifeCircleTime = pGetLog("pEndLifeCircleTime");
        let pUrlIndex = pGetLog("pUrlIndex");

        if(pUrlIndex != undefined){
            if(preEndLifeCircleTime != undefined) {
                if(await isRestDone(timeNow, preEndLifeCircleTime)) {
                    handleOpenTab(timeNow, pClose);
                } else {
                    if (pClose) {
                        pHiddenContainer();
                    }
                }
            } else {
                handleOpenTab(timeNow, pClose);
            }
        } else {
            if(await isLastIndex(0)) {
                pSetLog("pEndLifeCircleTime", timeNow);
                pHiddenContainer();
            }

            pIncludeClose = false;
            pSetLog("pUrlIndex", 0);
            window.open(pDeeplink(pUrls[0]), "_blank", 'noopener');
        }
    }

    function getBannerIndex() {
        let bannerUrl = document.querySelector('#pvoucher-live-icon img').src;

        if(bannerUrl == 'https://s3.ap-southeast-1.amazonaws.com/adpia.vn/util/upload_document/20230929/voucher_live_snhxhw.png') {
            bannerUrl = 'https://res.cloudinary.com/dwszylalu/image/upload/v1693450477/popup/voucher_live_snhxhw.png';
        }

        let bannerIndex = pBanners.indexOf(bannerUrl);

        return bannerIndex;
    }
});
