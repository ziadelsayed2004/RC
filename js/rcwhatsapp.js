// RCWhatsapp Page Script
(function () {
    const rcwa = CONFIG.products.rcwhatsapp;

    // Update title with version
    document.getElementById('productTitle').textContent = rcwa.name + ' v' + rcwa.version;

    // Generate package cards
    const grid = document.getElementById('packagesGrid');
    let i = 1;
    for (const [key, pkg] of Object.entries(rcwa.packages)) {
        const card = document.createElement('div');
        card.className = 'package-card';

        const icon = document.createElement('div');
        icon.className = 'package-card__icon';
        icon.innerHTML = '<span class="icon-num">' + i + '</span>';

        const name = document.createElement('h3');
        name.className = 'package-card__name';
        name.textContent = pkg.name;

        const desc = document.createElement('p');
        desc.className = 'package-card__desc';
        desc.innerHTML = pkg.title + '<br>' + pkg.description;

        const btn = document.createElement('a');
        btn.className = 'package-card__btn';
        btn.href = 'countdown.html?product=rcwhatsapp&package=' + key;
        btn.target = '_blank';
        btn.innerHTML = '<span>Download</span><span class="icon icon-arrow-right"></span>';

        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(desc);
        card.appendChild(btn);
        grid.appendChild(card);
        i++;
    }

    // Generate feature cards
    const featuresGrid = document.getElementById('featuresGrid');
    if (featuresGrid && rcwa.features) {
        for (const feature of rcwa.features) {
            const card = document.createElement('div');
            card.className = 'feature-card';

            const iconDiv = document.createElement('div');
            iconDiv.className = 'feature-card__icon';
            iconDiv.innerHTML = '<span class="icon icon-' + feature.icon + '"></span>';

            const title = document.createElement('h3');
            title.className = 'feature-card__title';
            title.textContent = feature.title;

            const list = document.createElement('ul');
            list.className = 'feature-card__list';
            for (const item of feature.items) {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            }

            card.appendChild(iconDiv);
            card.appendChild(title);
            card.appendChild(list);
            featuresGrid.appendChild(card);
        }
    }
})();
