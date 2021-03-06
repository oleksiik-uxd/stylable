import { expect } from "chai";
import { valueReplacer } from "../src/value-template";

describe('value-template', function () {

    it('should replace "value()" function with actual value', function(){
        const result = valueReplacer('value(A)', {A: 'the value'}, (value)=>value);
        expect(result).to.equal('the value');
    });

    it('should replace "value()" function with actual value with transform value', function(){
        const result = valueReplacer('value(A)', {A: 'the value'}, (value)=>value + '!!!')
        expect(result).to.equal('the value!!!');
    });

    it('should replace multiple "value()" functions with actual values', function(){
        const result = valueReplacer('value(A) value(B)', {A: 'the value', B: 'other value'}, (value)=>value);
        expect(result).to.equal('the value other value');
    });

    it('should replace reference "value()" functions with actual values', function(){
        const result = valueReplacer('value(A)', {A: 'value(B)', B: 'source value'}, (value)=>value);
        expect(result).to.equal('source value');
    });

    it('should handle cyclic "value()"', function(){
        const result = valueReplacer('value(A)', {A: 'value(B)', B: 'value(A)'}, (value)=>value);
        expect(result).to.equal('cyclic value');
    });

    describe('debug', () => {

        it('should not add origin when value is the same', function(){
            const result = valueReplacer('blue', {A: 'x', B: 'y'}, (value)=>value, true);
            expect(result).to.equal('blue');
        });

        it('should add origin comment', function(){
            const result = valueReplacer('value(A) value(B)', {A: 'x', B: 'y'}, (value)=>value, true);
            expect(result).to.equal('x y /* value(A) value(B) */');
        });

        it('should add cyclic path comment', function(){
            const result = valueReplacer('value(A)', {A: 'value(B)', B: 'value(A)'}, (value)=>value, true);
            expect(result).to.equal('cyclic value(A>B>A) /* value(A) */');
        });

    });
    
});

