(function tryToInject() {
	// See if .calc_row.total has been added to the DOM yet
	try {
		const net_total_on_page = document.querySelector('div.calc_row.total');
		// Create new mutation observer, recalculate SR if any values change
		const mutateObserver = new MutationObserver(function(records) {
		  calculateSR();
		});
		// Set up mutation observer
		mutateObserver.observe(net_total_on_page, {
		  childList: true, // capture child add/remove on target element
		  characterData: true, // capture text changes on target element
		  subtree: true, // capture childs changes too
		  characterDataOldValue: true // keep of prev value
		});
		// Get income and expenses and calculate SR
		const calculateSR = function() {
			// If savings rate div already exists, remove it
			const existing_sr_div = document.querySelector('div.savings_rate');
		    if (existing_sr_div) {
		  	  existing_sr_div.parentNode.removeChild(existing_sr_div);
		    }
		    // Get income, remove the comma
			let income = document.querySelector('div.calc_row.income p.value span.amount').innerText;
			income = parseFloat(income.replace(/,/g, ''));
			// Get expenses, remove the comma
			let expenses = document.querySelector('div.calc_row.spending p.value span.amount').innerText;
			expenses = parseFloat(expenses.replace(/,/g, ''));
			// Ignore goals because presumably those are being saved as well
			// Calculate net left over
			const net_total = income - expenses;
			const savings_rate = ((net_total / income)*100).toFixed(1) + "%";
			// If negative, add negative class
			isNegative = '';
			if (net_total < 0) {
				isNegative = 'negative';
			}
			// Add SR div to page
			const savings_rate_div = document.createElement('div');
			savings_rate_div.className = 'calc_row total savings_rate';
			savings_rate_div.innerHTML = '<p class="label">SR:</p><p class="value up '+isNegative+'"><span class="amount">'+savings_rate+'</span></p>';
			document.querySelector('div.calc_leftover').appendChild(savings_rate_div);
		};
		calculateSR();
	}
	// If .calc_row.total hasn't been added to the DOM yet, wait 3s and try again to calculate SR
	catch(err) {
		setTimeout(function(){
			tryToInject();
		}, 3000);
	}
})();