$(document).ready(function() {
    
    /**
     * Checks all the checkboxes in a specific fieldset, on user click.
     */
    $(function () {
        $('.checkAll').on('click', function () {
            $(this).closest('fieldset').find(':checkbox').prop('checked', this.checked);
        });
    });

    /**
     * Add commas and a dollar sign while user is typing. Also removes cents and spaces and some other garbage.
     * 
     * jQuery formatCurrency plugin: http://plugins.jquery.com/project/formatCurrency
     */
    $(function() {

        // Format while typing & warn on decimals entered, no cents
        $('.formatInput').blur(function() {
            $(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: 0 });
        })
        .keyup(function(e) {
            var e = window.event || e;
            var keyUnicode = e.charCode || e.keyCode;
            if (e !== undefined) {
                switch (keyUnicode) {
                    case 16: break; // Shift
                    case 27: this.value = ''; break; // Esc: clear entry
                    case 35: break; // End
                    case 36: break; // Home
                    case 37: break; // cursor left
                    case 38: break; // cursor up
                    case 39: break; // cursor right
                    case 40: break; // cursor down
                    case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
                    case 110: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
                    case 190: break; // .
                    default: $(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
                }
            }
        });
    });


    /**
     * Main Calculator
     * 
     * When form is submitted, calculate basic income, and display it in <div id="result"><div>
     */
    $("#calculate").click(function () {

        var usCitizens = $("#usCitizens").val(),
            socialSecurity = $("#socialSecurity").val();
            unemploymentWelfare = $("#unemploymentWelfare").val();
            medicare = $("#medicare").val();
            medicaid = $("#medicaid").val();
            interestOnDebt = $("#interestOnDebt").val();
            defenseSpending = $("#defenseSpending").val();
            otherDiscretionary = $("#otherDiscretionary").val();

        var inputs = [ 
                usCitizens, 
                socialSecurity,
                unemploymentWelfare,
                medicare,
                medicaid,
                interestOnDebt,
                defenseSpending,
                otherDiscretionary
            ],
            cleanInputs = [];

        /**
         * Clean up the data for manipulation.
         */
        function cleanUp( rawInput ) {
            var withOutCommas = rawInput.replace(/,/g, "");
            var removeWhiteSpace = withOutCommas.replace(/\s/g, "");
            var floated = parseFloat(removeWhiteSpace);
            return floated;
        }

        $(inputs).each(function() {
            currentInput = cleanUp(this);
            cleanInputs.push(currentInput);
        });

        var usCitizensClean = cleanInputs[0],
            socialSecurityClean = cleanInputs[1],
            unemploymentWelfareClean = cleanInputs[2],
            medicareClean = cleanInputs[3],
            medicaidClean = cleanInputs[4],
            interestOnDebtClean = cleanInputs[5],
            defenseSpendingClean = cleanInputs[6],
            otherDiscretionarylean = cleanInputs[7];

        if ($("#socialSecurityChecked").prop("checked") === false) { socialSecurityClean = 0; }
        if ($("#unemploymentWelfareChecked").prop("checked") === false) { unemploymentWelfareClean = 0; }
        if ($("#medicareChecked").prop("checked") === false) { medicareClean = 0; }
        if ($("#medicaidChecked").prop("checked") === false) { medicaidClean = 0; }
        if ($("#interestOnDebtChecked").prop("checked") === false) { interestOnDebtClean = 0; }
        if ($("#defenseSpendingChecked").prop("checked") === false) { defenseSpendingClean = 0; }
        if ($("#otherDiscretionaryChecked").prop("checked") === false) { otherDiscretionarylean = 0; }

        var sum = (socialSecurityClean + unemploymentWelfareClean + medicareClean
                + medicaidClean + interestOnDebtClean + defenseSpendingClean 
                + otherDiscretionarylean) / usCitizensClean,
            rounded = Math.round( sum ),
            roundedWithCommas = rounded.toLocaleString("en-US");
            perMonth = Math.round (rounded / 12);
            perMonthWithCommas = perMonth.toLocaleString("en-US");

        $("#result").html("$" + roundedWithCommas + " per citizen<br>$" + perMonthWithCommas + " per month per citizen");

    });

});