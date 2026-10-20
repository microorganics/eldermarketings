document.addEventListener('DOMContentLoaded', function() {
    // Create WhatsApp widget container
    const whatsappWidget = document.createElement('div');
    whatsappWidget.id = 'whatsapp-widget';
    
    // Create WhatsApp button with icon
    const whatsappButton = document.createElement('div');
    whatsappButton.className = 'whatsapp-button';
    
    // Create WhatsApp icon
    const whatsappIcon = document.createElement('div');
    whatsappIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M25.4995 4.29102C22.7231 1.52039 18.9772 0 15.0173 0C6.77716 0 0.0345626 6.71132 0.0345626 14.9139C0.0345626 17.5392 0.741115 20.0991 2.08016 22.3333L0 30L7.87649 27.9571C10.0508 29.1719 12.5064 29.8279 15.0173 29.8279C23.2575 29.8279 30 23.1165 30 14.9139C30 10.9699 28.276 6.06165 25.4995 4.29102ZM15.0173 27.3333C12.7777 27.3333 10.573 26.7077 8.64795 25.5232L8.19295 25.2451L3.5453 26.4599L4.78016 21.9241L4.46495 21.4596C3.16217 19.4674 2.47573 17.226 2.47573 14.9139C2.47573 8.08253 8.14915 2.49458 15.0173 2.49458C18.3257 2.49458 21.4638 3.76874 23.8153 6.12047C26.1668 8.4722 27.5587 11.5922 27.5587 14.9139C27.5587 21.7452 21.8853 27.3333 15.0173 27.3333ZM21.8503 18.0341C21.4653 17.8412 19.6628 16.9527 19.3128 16.8247C18.9628 16.697 18.7077 16.6317 18.4527 17.0157C18.1977 17.3996 17.4952 18.2228 17.2751 18.4766C17.0551 18.7304 16.835 18.763 16.45 18.5701C16.065 18.3772 14.8901 18.0038 13.4982 16.7602C12.4081 15.7908 11.6706 14.5962 11.4505 14.2123C11.2305 13.8284 11.4272 13.6238 11.6173 13.4399C11.7872 13.2769 11.9997 13.0161 12.1848 12.7969C12.3698 12.5777 12.4348 12.4171 12.5648 12.1632C12.6948 11.9094 12.6298 11.6902 12.5298 11.4974C12.4298 11.3045 11.6905 9.51066 11.3705 8.74279C11.0504 7.97492 10.7304 8.08253 10.5104 8.08253C10.2903 8.08253 10.0353 8.04995 9.78025 8.04995C9.52525 8.04995 9.1102 8.14933 8.7602 8.53321C8.4102 8.91709 7.45019 9.80553 7.45019 11.5994C7.45019 13.3932 8.7602 15.1217 8.94521 15.3755C9.13021 15.6294 11.6656 19.439 15.4973 21.0047C16.3858 21.3886 17.0801 21.6099 17.6201 21.7778C18.5151 22.0642 19.3278 22.0316 19.9703 21.9322C20.6828 21.8219 22.1397 21.0371 22.4597 20.1486C22.7797 19.2602 22.7797 18.4924 22.6797 18.3121C22.5797 18.1318 22.3247 18.0324 21.9397 17.8395L21.8503 18.0341Z" fill="white"/>
        </svg>
    `;
    
    // Create tooltip that appears on hover
    const tooltip = document.createElement('div');
    tooltip.className = 'whatsapp-tooltip';
    tooltip.textContent = 'Chat with us on WhatsApp';
    
    // Add click event to open WhatsApp with predefined message
    whatsappButton.addEventListener('click', function() {
        const phone = '917015137396';
        const message = 'Hello, I am interested to know more about your business.';
        const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        
        // Track event in Google Analytics if available
        if (typeof gtag === 'function') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'Contact',
                'event_action': 'click',
                'event_label': 'WhatsApp Button'
            });
        }
        
        window.open(whatsappURL, '_blank');
    });
    
    // Add pulse animation after 5 seconds for newly landed visitors
    setTimeout(function() {
        whatsappButton.classList.add('whatsapp-pulse');
        
        // Remove pulse after 3 pulses (4.5 seconds)
        setTimeout(function() {
            whatsappButton.classList.remove('whatsapp-pulse');
        }, 4500);
    }, 5000);
    
    // Assemble the widget
    whatsappButton.appendChild(whatsappIcon);
    whatsappWidget.appendChild(tooltip);
    whatsappWidget.appendChild(whatsappButton);
    
    // Add the widget to the page
    document.body.appendChild(whatsappWidget);
});
