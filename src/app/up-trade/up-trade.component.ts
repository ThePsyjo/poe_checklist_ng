import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";

interface Combination extends Record<string, any> {
  number: number;
  combination: string;
}

@Component({
  selector: 'app-up-trade',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './up-trade.component.html',
  styleUrl: './up-trade.component.css'
})
export class UpTradeComponent {
  value = 4;  // default count

  calcCombinations(array: any[], size: number) {

    function p(t: any[], i: number) {
      if (t.length === size) {
        result.push(t);
        return;
      }
      if (i + 1 > array.length) {
        return;
      }
      p(t.concat(array[i]), i + 1);
      p(t, i + 1);
    }

    var result: any[] = [];
    p([], 0);
    return result;
  }

  * getCombinations(): Generator<Combination> {
    let n = 1
    for (const combination of this.calcCombinations(Array.from(Array(this.value).keys()).map(v => v + 1), 3)) {
      yield {number: n++, combination: Array(...combination).join(' - ')};
    }
  }
}
