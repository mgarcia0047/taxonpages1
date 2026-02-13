import MyPanelComponent from './MyPanelComponent.vue'

Export default {
   id: 'panel:test', // ID to identify this panel
   component: MyPanelComponent, // Vue component for your panel
   rankGroup: ['HigherClassificationGroup', 'FamilyGroup', 'GenusGroup', 'SpeciesGroup'] // <-- OPTIONAL: This will define for which rank group will be available, remove it if your panel will be available for all.
}
