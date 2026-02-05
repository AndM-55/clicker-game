//interface that all Upgrades must adhere to 
export default interface Upgrade {
    applyEffect(base: number) : number;
}