/**
 * A JavaScript Playing Card Library
 *
 * @author     James Brumond
 * @version    0.1.0
 * @copyright  Copyright 2011 James Brumond
 * @license    Dual licensed under MIT and GPL
 * @link       https://github.com/kbjr/cards.js
 */

(function() {
	var CardsJS = { };
	
// ----------------------------------------------------------------------------
//  Ready Handler
	
	/**
	 * Run a function when the library is ready (or, check if the library is loaded)
	 *
	 * @access  public
	 * @param   function  the callback
	 * @return  boolean
	 */
	CardsJS.ready = (function() {
		var
		stack = [ ],
		ready = false,
		result = function(callback) {
			if (typeof callback === 'function') {
				if (ready) {
					runAsync(callback);
				} else {
					stack.push(callback);
				}
			}
			return ready;
		};
		result._isReady = (function() {
			var
			library = false,
			polyfills = false;
			return function(what) {
				switch (what) {
					case 'library':
						library = true;
					break;
					case 'polyfills':
						polyfills = true;
					break;
				}
				if (library && polyfills && ! ready) {
					ready = true;
					stack.forEach(function(callback) {
						runAsync(callback);
					});
				}
			};
		}());
		return result;
	}());
	
// ----------------------------------------------------------------------------
//  Do Feature Tests
	
	(function() {
		var features = [
			Array.isArray,
			Array.prototype.filter,
			Array.prototype.indexOf,
			Array.prototype.forEach,
		];
		// Figure out which polyfills we need
		for (var i = 0, c = features.length; i < c; i++) {
			if (! features[i]) {
				throw new Error(
					'CardsJS: Needed features are missing for this library to run in this environment. ' +
					'See the documentation for instructions on polyfilling missing features.'
				);
			}
		};
	}());
	
// ----------------------------------------------------------------------------
//  Card Type Information
	
	var
	suits = ['spades', 'hearts', 'clubs', 'diamonds'],
	values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
	specialCards = ['joker'],
	
	// Used for auto-building specialized decks
	pinochleValues = ['A', '10', 'K', 'Q', 'J', '9'];
	
// ----------------------------------------------------------------------------
//  The Card Class
	
	CardsJS.Card = function(suit, value) {
		
	// ----------------------------------------------------------------------------
	//  Test the arguments given
		
		// Check that we have 2 string params
		if (typeof suit !== 'string' || typeof value !== 'string') {
			throw new TypeError('CardsJS.Card: string parameters expected');
		}
		
		// Check if this is a special card
		if (suit === 'special') {
			if (specialCards.indexOf(value) < 0) {
				throw new Error('CardsJS.Card: invalid special card given');
			}
		}
		
		// Otherwise, just check for a valid suit/value
		else if (suits.indexOf(suit) < 0 || values.indexOf(value) < 0) {
			throw new Error('CardsJS.Card: invalid suit or value given');
		}
	
	// ----------------------------------------------------------------------------
	//  Publics
		
		this.deck = null;
		this.suit = suit;
		this.value = value;
		
	};
	
// ----------------------------------------------------------------------------
//  The Deck Class
	
	CardsJS.Deck = function() {
		var self = this;
		
		this.cards = [ ];
		
		/**
		 * Seed the deck with a particular set of cards
		 *
		 * @access  public
		 * @param   string    the type of deck (eg. "poker")
		 * @return  void
		 */
		this.seedDeck = function(type) {
			populateDeck(type, function(suit, value) {
				self.cards.push(new CardsJS.Card(suit, value));
			});
		};
		
		/**
		 * Find cards based on suit, value, or both
		 *
		 * @access  public
		 * @param   string    the suit (or null)
		 * @param   string    the value (or null)
		 * @return  array
		 */
		this.find = function(suit, value) {
			// Make sure we have some value to work with
			if (suit ==/*=*/ null && value ==/*=*/ null) {
				throw new Error('CardsJS.Deck.find: no search data given');
			}
			// Look through the deck, finding the matching cards
			return this.filter(function() {
				// If suit is null, just look based on value
				if (suit ==/*=*/ null) {
					return function(card) {
						return (card.value === value);
					};
				}
				// If value is null, just look based on suit
				else if (value ==/*=*/ null) {
					return function(card) {
						return (card.suit === suit);
					};
				}
				// If both suit and value are given, look for both
				else {
					return function(card) {
						return (card.suit === suit && card.value === value);
					};
				}
			}());
		};
		
		/**
		 * Find cards based on a callback condition
		 *
		 * @access  public
		 * @param   function  (object card)
		 * @return  array
		 */
		this.filter = function(callback) {
			return this.cards.filter(function(card) {
				return callback(card);
			});
		};
		
		/**
		 * Check if a given card is in this deck
		 *
		 * @access  public
		 * @param   object    the card to look for
		 * @return  boolean
		 */
		this.contains = function(card) {
			return (this.cards.indexOf(card) > -1);
		};
		
	};
	
// ----------------------------------------------------------------------------
//  Helper Functions
	
	function populateDeck(type, callback) {
		switch (type) {
			case 'poker':
				suits.forEach(function(suit) {
					values.forEach(function(value) {
						callback(suit, value);
					});
				});
			break;
			case 'pinochle':
				suits.forEach(function(suit) {
					pinochleValues.forEach(function(value) {
						callback(suit, value);
					});
					pinochleValues.forEach(function(value) {
						callback(suit, value);
					});
				});
			break;
			default:
				throw new Error('CardsJS::populateDeck: unknown deck type "' + type + '"');
			break;
			
		}
	};

	function runAsync(callback) {
		setTimeout(callback, 1);
	};

// ----------------------------------------------------------------------------
//  Expose
	
	try {
		module.exports = CardsJS;
	} catch (e) {
		window.CardsJS = CardsJS;
	}
	
}());

/* End of file cards.js */
