// RCGram Page Script
(function () {
    const rcgram = CONFIG.products.rcgram;

    // Update title with version
    document.getElementById('productTitle').textContent = rcgram.name + ' v' + rcgram.version;

    // Generate feature cards
    const featuresGrid = document.getElementById('featuresGrid');
    if (featuresGrid && rcgram.features) {
        for (const feature of rcgram.features) {
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
