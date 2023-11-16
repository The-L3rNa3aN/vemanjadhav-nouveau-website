/* A simple class for entities that manages health reduction, addition and other things. */

export default class BasicHealthSystem
{
    constructor()
    {
        this.health = undefined;
        this.maxHealth = undefined;
    }

    setInitialHealth(number) { this.health = number; }

    setMaxHealth(number) { this.maxHealth = number; }

    heal(number)
    {
        this.health += number;

        if(this.health > this.maxHealth) this.health = this.maxHealth;
    }

    damage(number)
    {
        this.health -= number;
    }
}