// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './plan-salarial.component.html',
  styleUrls: ['./plan-salarial.component.scss']
})
export default class PlanSalarialComponent {}
